import { getProducer } from "./connector";
import { fetchTrendingTags } from "./questionService";
import { connectFluvio } from "./connector";
import { Offset } from "@fluvio/client";
import { FetchedTag } from "../models/FetchedTags";

export async function produceTrendingTags() {
    const producer = await getProducer("trending-tags");
    const tags = await fetchTrendingTags();
  
    for (const tag of tags) {
      await producer.sendRecord(JSON.stringify(tag), 0);
    }
  }


  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  export async function consumeTrendingTags() {
    const fluvio = await connectFluvio();
    const consumer = await fluvio.partitionConsumer("trending-tags", 0);
  
    const batch: any[] = [];
    const BATCH_SIZE = 100;
    const FLUSH_INTERVAL_MS = 5000;
  
    console.log('🚀 Starting to consume trending tags...');
  
    const interval = setInterval(async () => {
      if (batch.length > 0) {
        console.log(`🕒 Auto-flushing batch of ${batch.length} trending tags`);
        await flushBatch();
      }
    }, FLUSH_INTERVAL_MS);
  
    async function flushBatch() {
      if (batch.length > 0) {
        try {
          await FetchedTag.bulkWrite(batch);
          console.log(`✅ Saved batch of ${batch.length} trending tags`);
          batch.length = 0;
        } catch (err) {
          console.error('❌ Error saving trending tag batch, retrying...', err);
          await sleep(500);
          try {
            if (batch.length > 0) {
              await FetchedTag.bulkWrite(batch);
              console.log('✅ Retried and saved batch of trending tags');
              batch.length = 0;
            }
          } catch (finalErr) {
            console.error('❌ Final failure saving tag batch:', finalErr);
            batch.length = 0;
          }
        }
      }
    }
  
    await consumer.stream(Offset.FromEnd(), async (record) => {
      const value = record.valueString();
      const tagData = JSON.parse(value);
  
      batch.push({
        updateOne: {
          filter: { name: tagData.name },
          update: { $set: tagData },
          upsert: true
        }
      });
  
      if (batch.length >= BATCH_SIZE) {
        await flushBatch();
      }
    });
  
    process.on('SIGINT', async () => {
      console.log('\n🛑 Caught interrupt signal, flushing final tags...');
      clearInterval(interval);
      await flushBatch();
      process.exit();
    });
  }
  