import { Request, Response } from "express";
import { DataStore } from "../data/store";

export async function listServices(req: Request, res: Response) {
  try {
    const { city, material } = req.query;
    const services = await DataStore.getServices(city as string, material as string);
    res.json({ success: true, data: services });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getService(req: Request, res: Response) {
  try {
    const services = await DataStore.getServices();
    const service = services.find((s) => s.id === req.params.id || s._id === req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, error: "Recycler service not found" });
    }
    res.json({ success: true, data: service });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
