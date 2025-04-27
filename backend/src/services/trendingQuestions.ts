import { connectFluvio } from './connector';
import { FetchedQuestion } from '../models/FetchedQuestion';
import { Offset } from '@fluvio/client';
import { getProducer } from './connector';
import { fetchTrendingUnansweredQuestions, fetchQuestionsByTag } from './questionService';


function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export async function produceTrendingQuestions() {
  const producer = await getProducer("trending-questions");
  const questions = await fetchTrendingUnansweredQuestions();

  for (const question of questions) {
    await producer.sendRecord(JSON.stringify(question), 0);
  }
}


export async function consumeTrendingQuestions() {
  const fluvio = await connectFluvio();
  const consumer = await fluvio.partitionConsumer("trending-questions", 0);

  const batch: any[] = [];
  const BATCH_SIZE = 100;
  const FLUSH_INTERVAL_MS = 5000; // flush every 5 seconds even if batch isn't full

  console.log('🚀 Starting to consume trending questions...');

  // Background timer to flush batch every few seconds
  const interval = setInterval(async () => {
    if (batch.length > 0) {
      console.log(`🕒 Auto-flushing batch of ${batch.length} trending questions`);
      await flushBatch();
    }
  }, FLUSH_INTERVAL_MS);

  async function flushBatch() {
    if (batch.length > 0) {
      try {
        await FetchedQuestion.bulkWrite(batch);
        console.log(`✅ Saved batch of ${batch.length} trending questions`);
        batch.length = 0; // reset
      } catch (err) {
        console.error('❌ Error saving trending batch, retrying...', err);
        await sleep(500); // short pause
        try {
          if (batch.length > 0) {
            await FetchedQuestion.bulkWrite(batch);
            console.log(`✅ Retried and saved batch`);
            batch.length = 0;
          }
        } catch (finalErr) {
          console.error('❌ Final failure saving batch:', finalErr);
          batch.length = 0;
        }
      }
    }
  }

  await consumer.stream(Offset.FromEnd(), async (record) => {
    const value = record.valueString();
    const questionData = JSON.parse(value);

    batch.push({
      updateOne: {
        filter: { question_id: questionData.question_id },
        update: { $set: questionData },
        upsert: true
      }
    });

    if (batch.length >= BATCH_SIZE) {
      await flushBatch();
    }
  });

  // Handle graceful shutdown (Ctrl+C)
  process.on('SIGINT', async () => {
    console.log('\n🛑 Caught interrupt signal, flushing final batch...');
    clearInterval(interval); // stop the auto-flush timer
    await flushBatch(); // flush any remaining records
    process.exit();
  });
}


export async function produceTopicwiseQuestions(tag: string) {
    const producer = await getProducer("topicwise-questions");
    const questions = await fetchQuestionsByTag(tag);
  
    for (const question of questions) {
      await producer.sendRecord(JSON.stringify(question), 0);
    }
  }


  export async function consumeTopicwiseQuestions() {
    const fluvio = await connectFluvio();
    const consumer = await fluvio.partitionConsumer("topicwise-questions", 0);
  
    const batch: any[] = [];
    const BATCH_SIZE = 100;
  
    console.log('🚀 Starting to consume topicwise questions...');
  
    await consumer.stream(Offset.FromEnd(), async (record) => {
      const value = record.valueString();
      const questionData = JSON.parse(value);
  
      batch.push({
        updateOne: {
          filter: { question_id: questionData.question_id },
          update: { $set: questionData },
          upsert: true
        }
      });
  
      if (batch.length >= BATCH_SIZE) {
        try {
          await FetchedQuestion.bulkWrite(batch);
          console.log(`✅ Saved batch of ${batch.length} topicwise questions`);
          batch.length = 0;
        } catch (err) {
          console.error('❌ Error saving topicwise batch, retrying...', err);
          await sleep(500);
          try {
            await FetchedQuestion.bulkWrite(batch);
            console.log(`✅ Retried and saved batch`);
            batch.length = 0;
          } catch (finalErr) {
            console.error('❌ Final failure saving batch:', finalErr);
            batch.length = 0;
          }
        }
      }
    });
  
    process.on('SIGINT', async () => {
      if (batch.length > 0) {
        try {
          await FetchedQuestion.bulkWrite(batch);
          console.log(`✅ Flushed final batch of ${batch.length} topicwise questions`);
        } catch (err) {
          console.error('❌ Error flushing final topicwise batch:', err);
        }
      }
      process.exit();
    });
  }
  