import { connectFluvio } from './connector';
import { FetchedQuestion } from '../models/FetchedQuestion';
import { Offset } from '@fluvio/client';

export async function consumeTrendingQuestions() {
  const fluvio = await connectFluvio();
  const consumer = await fluvio.partitionConsumer("trending-questions", 0);

  console.log('Starting to consume trending questions...');

  await consumer.stream(Offset.FromBeginning(), async (record) => {
    const value = record.valueString();
    console.log('Received trending question:', value);

    const questionData = JSON.parse(value);

    try {
      await FetchedQuestion.updateOne(
        { question_id: questionData.question_id },
        { $set: questionData },
        { upsert: true }
      );
      console.log('✅ Question saved/updated in DB');
    } catch (err) {
      console.error('❌ Error saving question:', err);
    }
  });
}

export async function consumeTopicwiseQuestions() {
  const fluvio = await connectFluvio();
  const consumer = await fluvio.partitionConsumer("topicwise-questions", 0);

  console.log('Starting to consume topicwise questions...');

  await consumer.stream(Offset.FromBeginning(),async (record) => {
    const value = record.valueString();
    console.log('Received topicwise question:', value);

    const questionData = JSON.parse(value);

    try {
      await FetchedQuestion.updateOne(
        { question_id: questionData.question_id },
        { $set: questionData },
        { upsert: true }
      );
      console.log('✅ Topicwise Question saved/updated in DB');
    } catch (err) {
      console.error('❌ Error saving topicwise question:', err);
    }
  });
}
