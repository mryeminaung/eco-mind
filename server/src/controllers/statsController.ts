import { Request, Response } from "express";
import { DataStore } from "../data/store";
import { isDbConnected } from "../config/db";

export async function getStats(_req: Request, res: Response) {
  try {
    const stats = await DataStore.getImpactStats();
    res.json({
      success: true,
      data: stats,
      dbStatus: {
        connected: isDbConnected(),
        type: isDbConnected() ? "MongoDB Cloud/Local" : "In-Memory Resilient Store",
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
