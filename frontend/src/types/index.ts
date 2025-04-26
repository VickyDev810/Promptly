export interface LLMResponse {
  confidence: number;
  answer: string;
  escalate_to_human: boolean;
  tags: string[];
}

export interface Question {
  id: string;
  question: string;
  timestamp: string;
  status: 'answered' | 'pending' | 'escalated';
  response?: LLMResponse;
}

export interface User {
  id: string;
  username: string;
  avatar?: string;
}

export interface Answer {
  id: string;
  questionId: string;
  userId: string;
  answer: string;
  timestamp: string;
  votes: number;
  isAccepted: boolean;
}

export interface Comment {
  id: string;
  parentId: string; // can be question id or answer id
  userId: string;
  comment: string;
  timestamp: string;
} 

export interface FetchedQuestion {
  id: string;             // From question_id
  title: string;          // Question title
  link: string;           // Link to original post
  score: number;          // Upvotes / Score
  tags: string[];         // Tags like [javascript, css]
  creation_date: number;  // Unix timestamp (seconds)
}