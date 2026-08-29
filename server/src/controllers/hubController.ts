import { Request, Response } from "express";
import { DataStore } from "../data/store";

export async function listHubs(req: Request, res: Response) {
  try {
    const { city } = req.query;
    const hubs = await DataStore.getHubs(city as string);
    res.json({ success: true, data: hubs });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
