import { Router } from 'express';
import { askQuestion, getQuestions, getQuestionById, getTrendingQuestions, getTrendingQuestionById, publishTrendingQuestions, publishTopicQuestions, getTrendingTags, publishTrendingTags, getQuestionDetail } from '../controllers/questionController';

const router = Router();

// GET all questions (optionally by tag)
router.get('/trending/all', getTrendingQuestions);           // /api/questions/trending/all?tag=<tag>

// GET a trending question by ID
router.get('/trending/:id', getTrendingQuestionById);        // /api/questions/trending/:id

//Get Trending Tagas
router.get('/featured/tags', getTrendingTags);                          // /api/questions/featured/tags

// Fetch Trending Tags
router.get('/fetch/featured/tags', publishTrendingTags);                // /api/questions/fetch/featured/tags

// Get Question Details
router.get('/body/:id', getQuestionDetail);                                                    // /api/questions/body/:id

// Fluvio producer routes
router.get('/fetch/trending', publishTrendingQuestions);     // /api/questions/fetch/trending
router.get('/fetch/topic/:tag', publishTopicQuestions);      // /api/questions/fetch/topic/:tag

// GET a question by ID
router.get('/:id', getQuestionById);

// POST a new question
router.post('/', askQuestion);

export default router;
