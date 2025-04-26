import { Router } from 'express';
import { askQuestion, getQuestions, getQuestionById, getTrendingQuestions, getTrendingQuestionById, publishTrendingQuestions, publishTopicQuestions } from '../controllers/questionController';

const router = Router();

// GET all questions (optionally by tag)
router.get('/trending/all', getTrendingQuestions);           // /api/questions/trending/all?tag=<tag>

// GET a trending question by ID
router.get('/trending/:id', getTrendingQuestionById);        // /api/questions/trending/:id

// Fluvio producer routes
router.get('/fetch/trending', publishTrendingQuestions);     // /api/questions/fetch/trending
router.get('/fetch/topic/:tag', publishTopicQuestions);      // /api/questions/fetch/topic/:tag

// GET a question by ID
router.get('/:id', getQuestionById);

// POST a new question
router.post('/', askQuestion);

export default router;
