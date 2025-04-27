import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/promptly';

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ Failed to connect MongoDB', err);
    process.exit(1);
  }
}
