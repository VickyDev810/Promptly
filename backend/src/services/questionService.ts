import { getProducer } from "./connector";
import axios from "axios";

const STACKEXCHANGE_API = "https://api.stackexchange.com/2.3";

export async function fetchTrendingUnansweredQuestions() {
  const res = await axios.get(`${STACKEXCHANGE_API}/questions/unanswered`, {
    params: {
      order: "desc",
      sort: "votes",
      site: "stackoverflow", // or your target site
    },
  });

  const questions = res.data.items || [];
  return questions;
}

export async function produceTrendingQuestions() {
  const producer = await getProducer("trending-questions");
  const questions = await fetchTrendingUnansweredQuestions();

  for (const question of questions) {
    await producer.sendRecord(JSON.stringify(question), 0);
  }
}

export async function fetchQuestionsByTag(tag: string) {
    const res = await axios.get(`${STACKEXCHANGE_API}/questions/unanswered/${tag}`, {
      params: {
        order: "desc",
        sort: "activity",
        tagged: tag,
        site: "stackoverflow",
      },
    });
  
    const questions = res.data.items || [];
    return questions;
  }
  
  export async function produceTopicwiseQuestions(tag: string) {
    const producer = await getProducer("topicwise-questions");
    const questions = await fetchQuestionsByTag(tag);
  
    for (const question of questions) {
      await producer.sendRecord(JSON.stringify(question), 0);
    }
  }
  