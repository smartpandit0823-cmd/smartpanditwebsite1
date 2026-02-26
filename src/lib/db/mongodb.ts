import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
if (!global.mongooseCache) global.mongooseCache = cached;

const MONGO_OPTS = {
  bufferCommands: false,    // don't queue requests — fail fast if disconnected
  maxPoolSize: 10,          // keep up to 10 reusable connections
  minPoolSize: 2,           // always keep 2 warm (reduces cold start time)
  serverSelectionTimeoutMS: 5000,  // fail fast if Atlas unreachable
  socketTimeoutMS: 30000,
  connectTimeoutMS: 8000,
  heartbeatFrequencyMS: 10000,
};

export async function connectDB(): Promise<typeof mongoose> {
  // Already connected — return immediately (no latency)
  if (cached.conn) {
    return cached.conn;
  }

  // Kick off connection if not already in progress
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, MONGO_OPTS)
      .then((m) => {
        console.log("✅ MongoDB connected (pool ready)");
        return m;
      })
      .catch((e) => {
        console.error("❌ MongoDB connection failed:", e.message);
        cached.promise = null;
        throw e;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
