import mongoose from "mongoose";

let cached = (global as any).mongoose as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const MONGO_OPTS = {
  bufferCommands: false,
  maxPoolSize: 10,
  minPoolSize: 2,
};

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "Please define MONGODB_URI in your environment (.env.local locally or Vercel Project Settings -> Environment Variables in deployment)."
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongoUri, MONGO_OPTS).then((mongoose) => {
      console.log("✅ MongoDB connected natively");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    // Verify connection is alive (serverless connections can go stale)
    if (cached.conn.connection.readyState !== 1) {
      cached.conn = null;
      cached.promise = null;
      return connectDB();
    }
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
