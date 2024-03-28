import mongoose from 'mongoose';

export const connectToDatabase = async (uri: string = process.env.DATABASE_URL as string) => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to database');
  } catch (err) {
    console.error(err);
  }
};
