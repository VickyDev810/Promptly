import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import questionRoutes from './routes/questionRoutes';
import { connectDB } from './utils/db';
import { consumeTrendingQuestions, consumeTopicwiseQuestions } from './services/consumer';

// Function to start consuming Fluvio topics
async function startConsumption() {
  try {
    console.log('Starting initial consumption of questions...');
    await consumeTrendingQuestions();
  } catch (error) {
    console.error('Error starting initial consumption:', error);
  }
}

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
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
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Start server
startServer();


startConsumption();
export default app; 