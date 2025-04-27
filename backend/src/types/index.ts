import { Request, Response } from 'express';

export interface QuestionRequest {
  question: string;
}

export interface GeminiResponse {
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
  response?: GeminiResponse;
}

export interface TypedRequest<T> extends Request {
  body: T;
}

export interface TypedResponse<T> extends Response {
  json: (body: T) => TypedResponse<T>;
} 