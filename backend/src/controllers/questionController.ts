import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { processQuestion } from '../services/geminiService';
import { GeminiResponse, Question, QuestionRequest, TypedRequest } from '../types';
import { produceTrendingQuestions, produceTopicwiseQuestions } from "../services/trendingQuestions";
import { FetchedQuestion } from '../models/FetchedQuestion';
import { FetchedTag } from '../models/FetchedTags';
import { produceTrendingTags } from '../services/trendingTags';
import { fetchQuestionDetail } from '../services/questionService';

// In-memory storage for questions (would be replaced by a database in production)
const questions: Question[] = [];

/**
 * Ask a question to the AI
 */
export const askQuestion = async (req: TypedRequest<QuestionRequest>, res: Response) => {
  try {
    const { question } = req.body;
    
    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Question is required' });
    }

    console.log(`Received question: "${question}"`);
    
    try {
      // Process question through Gemini
      const aiResponse: GeminiResponse = await processQuestion(question);
      
      // Create new question record
      const newQuestion: Question = {
        id: uuidv4(),
        question,
        timestamp: new Date().toISOString(),
        status: aiResponse.escalate_to_human ? 'escalated' : 'answered',
        response: aiResponse
      };
      
      // Save question (to in-memory store for now)
      questions.push(newQuestion);
      
      // Return the AI response
      return res.status(200).json(aiResponse);
    } catch (aiError) {
      console.error('Error with AI processing:', aiError);
      
      // Create a graceful fallback response
      const fallbackResponse: GeminiResponse = {
        confidence: 0.3,
        answer: "I'm currently having trouble processing this question. It might be a technical issue or a complex question that would benefit from human expertise.",
        escalate_to_human: true,
        tags: ['system-error', 'needs-attention']
      };
      
      // Create new question record with fallback
      const newQuestion: Question = {
        id: uuidv4(),
        question,
        timestamp: new Date().toISOString(),
        status: 'escalated',
        response: fallbackResponse
      };
      
      // Save question
      questions.push(newQuestion);
      
      // Return the fallback response
      return res.status(200).json(fallbackResponse);
    }
  } catch (error) {
    console.error('Error processing question:', error);
    return res.status(500).json({ error: 'Failed to process question' });
  }
};

/**
 * Get all questions
 */
export const getQuestions = (req: Request, res: Response) => {
  return res.status(200).json(questions);
};

/**
 * Get a question by ID
 */
export const getQuestionById = (req: Request, res: Response) => {
  const { id } = req.params;
  const question = questions.find(q => q.id === id);
  
  if (!question) {
    return res.status(404).json({ error: 'Question not found' });
  }
  
  return res.status(200).json(question);
}; 

/**
 * Get Trending question 
 */
export async function publishTrendingQuestions(req: Request, res: Response) {
  try {
    await produceTrendingQuestions();
    res.json({ message: "Trending unanswered questions published" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to publish questions" });
  }
};

/**
 * Get a question by Topic
 */
export async function publishTopicQuestions(req: Request, res: Response) {
  try {
    const { tag } = req.params;
    await produceTopicwiseQuestions(tag);
    res.json({ message: `Questions for tag ${tag} published` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to publish topicwise questions" });
  }
};


/**
 * Get all trending questions (optionally by tag)
 */
export async function getTrendingQuestions(req: Request, res: Response) {
  try {
    // Check if there is a 'tag' query parameter
    const { tag } = req.query;

    // If 'tag' is provided in the query, filter by it
    let query = {};
    if (tag) {
      query = { tags: tag };
    }

    // Fetch questions based on the query and sort them by creation date
    const questions = await FetchedQuestion.find(query).sort({ creation_date: -1 }).limit(50);
    res.json(questions);
  } catch (error) {
    console.error('❌ Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
}

/**
 * Get a trending question by ID
 */
export async function getTrendingQuestionById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Fetch a question by its unique question_id
    const question = await FetchedQuestion.findOne({ question_id: id });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error('❌ Error fetching question by ID:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
}


/**
 * Get Trending Tags
 */
export async function publishTrendingTags(req: Request, res: Response) {
  try {
    await produceTrendingTags();
    res.json({ message: "Trending tags  published" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to publish tags" });
  }
};

/**
 * Get Trending Tags
 */

export async function getTrendingTags(req: Request, res: Response) {
  try {
    const tags = await FetchedTag.find().sort({ name: 1 }).limit(50);
    res.json(tags);
  } catch (error) {
    console.error('❌ Error fetching trending tags:', error);
    res.status(500).json({ error: 'Failed to fetch trending tags' });
  }
}

/**
 * Get Question Details
 */


export async function getQuestionDetail(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const question = await fetchQuestionDetail(id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    console.error('❌ Error fetching question details:', error);
    res.status(500).json({ error: 'Failed to fetch question details' });
  }
}