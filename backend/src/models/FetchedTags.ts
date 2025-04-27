// models/FetchedTag.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IFetchedTag extends Document {
  name: string;
}

const FetchedTagSchema = new Schema<IFetchedTag>({
  name: { type: String, required: true, unique: true },
});

export const FetchedTag = mongoose.model<IFetchedTag>('FetchedTag', FetchedTagSchema);
