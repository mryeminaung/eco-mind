import { Request, Response } from "express";
import { DataStore } from "../data/store";

export async function listPickups(req: Request, res: Response) {
  try {
    const { city, status, phone } = req.query;
    const pickups = await DataStore.getPickups({
      city: city as string,
      status: status as string,
      phone: phone as string,
    });
    res.json({ success: true, data: pickups });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getPickup(req: Request, res: Response) {
  try {
    const pickup = await DataStore.getPickupById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ success: false, error: "Pickup request not found" });
    }
    res.json({ success: true, data: pickup });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function createPickup(req: Request, res: Response) {
  try {
    const {
      citizenName,
      citizenPhone,
      city,
      township,
      address,
      items,
      totalEstimatedWeightKg,
      preferredDate,
      preferredTimeSlot,
      notes,
    } = req.body;

    if (!citizenName || !citizenPhone || !city || !township || !address || !items || !totalEstimatedWeightKg) {
      return res.status(400).json({
        success: false,
        error: "Missing required pickup fields (name, phone, city, township, address, items, weight)",
      });
    }

    const created = await DataStore.createPickup({
      citizenName,
      citizenPhone,
      city,
      township,
      address,
      items,
      totalEstimatedWeightKg: Number(totalEstimatedWeightKg),
      preferredDate: preferredDate || new Date().toISOString().split("T")[0],
      preferredTimeSlot: preferredTimeSlot || "morning",
      notes: notes || "",
    });

    res.status(201).json({ success: true, data: created });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function updatePickupStatus(req: Request, res: Response) {
  try {
    const { status, assignedCollectorId, assignedCollectorName, actualWeightKg } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: "Status field is required" });
    }

    const updated = await DataStore.updatePickupStatus(req.params.id, {
      status,
      assignedCollectorId,
      assignedCollectorName,
      actualWeightKg: actualWeightKg ? Number(actualWeightKg) : undefined,
    });

    if (!updated) {
      return res.status(404).json({ success: false, error: "Pickup request not found" });
    }

    res.json({ success: true, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
