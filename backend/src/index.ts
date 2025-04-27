import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import questionRoutes from './routes/questionRoutes';
import { connectDB } from './utils/db';
import { consumeTrendingQuestions, consumeTopicwiseQuestions } from './services/trendingQuestions';
import { consumeTrendingTags } from './services/trendingTags';

// Function to start consuming Fluvio topics
async function startConsumption() {
  try {
    console.log('Starting initial consumption of questions...');
    await consumeTrendingQuestions();
    console.log('Starting initial consumption of tags.....');
    await consumeTrendingTags();
  } catch (error) {
    console.error('Error starting initial consumption:', error);
  }
}

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const port: number = Number(process.env.PORT) || 5000; // Ensure port is always a number

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.REACT_APP_FRONTEND_URL || '*', // Specify your React app's URL or use '*' for all domains
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/questions', questionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

async function startServer() {
  await connectDB();
  app.listen(port, '0.0.0.0', () => {  // Listen on all network interfaces
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Start server
startServer();

// Start consuming Fluvio topics
startConsumption();

export default app;
