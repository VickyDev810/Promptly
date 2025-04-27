import mongoose, { Schema, Document } from 'mongoose';

export interface IFetchedQuestion extends Document {
  question_id: number;
  title: string;
  link: string;
  tags: string[];
  creation_date: number;
  is_answered: boolean;
  score: number;
  body: string; // New field for the question body
}

const FetchedQuestionSchema = new Schema<IFetchedQuestion>({
  question_id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  link: { type: String, required: true },
  tags: { type: [String], default: [] },
  creation_date: { type: Number, required: true },
  is_answered: { type: Boolean, default: false },
  score: { type: Number, default: 0 },
  body: { type: String, required: true }, // New field
});

export const FetchedQuestion = mongoose.model<IFetchedQuestion>('FetchedQuestion', FetchedQuestionSchema);
