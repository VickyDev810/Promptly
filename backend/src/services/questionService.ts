import { getProducer } from "./connector";
import axios from "axios";

const STACKEXCHANGE_API = "https://api.stackexchange.com/2.3";
const STACKEXCHANGE_API_KEY = process.env.STACKEXCHANGE_API_KEY || 'your-stack-key';


// Trending Questions


export async function fetchTrendingUnansweredQuestions() {
  const res = await axios.get(`${STACKEXCHANGE_API}/questions/unanswered`, {
    params: {
      order: "desc",
      sort: "votes",
      site: "stackoverflow", // or your target site
      key: STACKEXCHANGE_API_KEY,
    },
  });

  const questions = res.data.items || [];
  return questions;
}


// Trending Question By Tags

export async function fetchQuestionsByTag(tag: string) {
    const res = await axios.get(`${STACKEXCHANGE_API}/questions/unanswered/`, {
      params: {
        order: "desc",
        sort: "activity",
        tagged: tag,
        site: "stackoverflow",
        key: STACKEXCHANGE_API_KEY,

      },
    });
  
    const questions = res.data.items || [];
    return questions;
  }

  // Question Details
  
  export async function fetchQuestionDetail(id: string) {
    const res = await axios.get(`${STACKEXCHANGE_API}/questions/${id}`, {
      params: {
        order: "desc",
        sort: "activity",
        filter: "!6WPIomnurtKpr",
        site: "stackoverflow",
        key: STACKEXCHANGE_API_KEY,

      },
    });
  
    const question = res.data.items[0] || null;
    return question;
  }



// Tags

export async function fetchTrendingTags() {
  const res = await axios.get(`${STACKEXCHANGE_API}/tags`, {
    params: {
      order: "desc",
      sort: "popular",
      site: "stackoverflow",
      key: STACKEXCHANGE_API_KEY,

    },
  });
  const tags = res.data.items || [];
  return tags;
}


