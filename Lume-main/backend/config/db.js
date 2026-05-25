import mongoose from 'mongoose';
import 'dotenv/config';

// Global cache to survive hot reloads in development and serverless freezing
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering to fail fast if no connection (prevents timeout hangs)
      serverSelectionTimeoutMS: 30000, // Increased timeout for Vercel cold starts
      socketTimeoutMS: 45000,
    };

    console.log('Initializing MongoDB connection...');
    cached.promise = mongoose.connect(process.env.MONGO_DB_URI, opts).then((mongoose) => {
      console.log('MongoDB Connected Successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB Connection Error:', e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;