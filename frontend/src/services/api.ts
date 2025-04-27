import axios from 'axios';
import { LLMResponse, FetchedQuestion } from '../types';

// API configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// For demo purposes, we'll keep some mock data and fall back to it if the API is not available
const mockDatabase = {
  users: [
    { id: 'user1', username: 'TechGuru', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 'user2', username: 'CodeMaster', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: 'user3', username: 'DevWizard', avatar: 'https://i.pravatar.cc/150?img=3' },
  ],
};

// Helper function to generate ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// API methods
export const apiService = {
  // Ask a question to the LLM
  async askQuestion(question: string): Promise<LLMResponse> {
    try {
      // Call the backend API
      const response = await apiClient.post('/questions', { question });
      return response.data;
    } catch (error) {
      console.error('Error asking question:', error);
      
      // Fallback to mock data if API is unavailable
      console.log('Using mock data as fallback');
      return {
        confidence: Math.random(), // Random confidence level
        answer: `Here's an answer to your question: "${question}". This is a detailed technical response that demonstrates how the LLM would generate an answer.`,
        escalate_to_human: Math.random() < 0.3, // 30% chance to escalate
        tags: ['javascript', 'react', 'typescript'].slice(0, Math.floor(Math.random() * 3) + 1),
      };
    }
  },
  
  // Get user's question history
  async getQuestions() {
    try {
      // Call the backend API
      const response = await apiClient.get('/questions');
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      
      // Return empty array if API is unavailable
      return [];
    }
  },
  
  // Get specific question
  async getQuestion(questionId: string) {
    try {
      // Call the backend API
      const response = await apiClient.get(`/questions/${questionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching question:', error);
      throw error;
    }
  },
  
  // Get user information (still using mock data)
  async getUser(userId: string) {
    try {
      // In a full implementation, this would call the backend
      // const response = await apiClient.get(`/users/${userId}`);
      // return response.data;
      
      // For now, use mock data
      return mockDatabase.users.find(u => u.id === userId);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
// Publish trending unanswered questions
async publishTrendingQuestions() {
  try {
    const response = await apiClient.get('/questions/fetch/trending');
    return response.data;
  } catch (error) {
    console.error('Error publishing trending questions:', error);
    throw error;
  }
},

// Publish topic-wise questions
async publishTopicQuestions(tag: string) {
  try {
    const response = await apiClient.get(`/questions/fetch/topic/${tag}`);
    return response.data;
  } catch (error) {
    console.error(`Error publishing questions for tag "${tag}":`, error);
    throw error;
  }
},
// For fetching all trending questions 
async getTrendingQuestions() {
  const url = '/questions/trending/all';
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching trending questions:', error);
    return [];
  }
},

// For fetching trending questions by tag
async getTrendingQuestionsByTag(tag : string) {
  const url = `/questions/trending/all?tag=${tag}`;
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching trending questions:', error);
    return [];
  }
},

async getTrendingTags() {
  const url = '/questions/featured/tags';
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error ('Error fetching trending tags:', error);
    return [];
  }
},

async getQuestionDetail(id: string) {
  try {
    const response = await apiClient.get(`/questions/body/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching question details:', error);
    return null;
  }
}


};

export default apiService; 