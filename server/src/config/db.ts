import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI)
if (!MONGODB_URI) {
  // eslint-disable-next-line no-console
  console.warn("MONGODB_URI is not set. Database connection will fail.");
}

export async function connectDB(): Promise<void> {
  if (!MONGODB_URI) {
    console.log(MONGODB_URI)
    throw new Error("MONGODB_URI environment variable is required");
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(MONGODB_URI, {
    dbName: process.env.MONGODB_DB_NAME ?? undefined
  });
}

