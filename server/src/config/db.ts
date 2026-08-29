import mongoose from "mongoose";

let isConnected = false;
let connectionAttempted = false;

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log("ℹ️ [MongoDB] No MONGODB_URI provided in environment. Running with in-memory resilient storage for MVP demo.");
    return false;
  }

  if (isConnected) {
    return true;
  }

  try {
    connectionAttempted = true;
    console.log(`🔌 [MongoDB] Connecting to ${uri.replace(/\/\/.*@/, "//<credentials>@")}...`);
    
    // Set a short timeout so app doesn't hang if local mongodb is not running
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500,
    });

    isConnected = true;
    console.log("✅ [MongoDB] Connected successfully to database");
    return true;
  } catch (error: any) {
    console.warn("⚠️ [MongoDB] Could not connect to remote MongoDB instance (" + (error?.message || error) + "). Using fallback in-memory store.");
    isConnected = false;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
