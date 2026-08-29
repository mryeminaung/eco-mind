import { Request, Response } from "express";
import { DataStore } from "../data/store";

export async function listEvents(_req: Request, res: Response) {
  try {
    const events = await DataStore.getEvents();
    res.json({ success: true, data: events });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function joinEvent(req: Request, res: Response) {
  try {
    const event = await DataStore.joinEvent(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, error: "Event not found" });
    }
    res.json({ success: true, data: event });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
