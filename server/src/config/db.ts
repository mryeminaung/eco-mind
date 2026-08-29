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
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });

    isConnected = true;
    const dbName = mongoose.connection.name || "ecomind";
    console.log(`✅ [MongoDB] Connected to local database "${dbName}" (${mongoose.connection.host}:${mongoose.connection.port})`);
    return true;
  } catch (error: any) {
    console.warn("⚠️ [MongoDB] Could not connect (" + (error?.message || error) + "). Using fallback in-memory store. Compass will stay empty.");
    isConnected = false;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
