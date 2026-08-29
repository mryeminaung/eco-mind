import { Request, Response } from "express";
import { DataStore } from "../data/store";

export async function listCenters(req: Request, res: Response) {
  try {
    const { material, search } = req.query;
    const centers = await DataStore.getRecyclingCenters(
      material as string | undefined,
      search as string | undefined
    );
    res.json({ success: true, data: centers, count: centers.length });
  } catch (error: any) {
    console.error("Error fetching recycling centers:", error);
    res.status(500).json({ success: false, error: error?.message || "Failed to fetch recycling centers" });
  }
}

export async function getCenter(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const center = await DataStore.getRecyclingCenterById(id);
    if (!center) {
      res.status(404).json({ success: false, error: `Recycling center with id '${id}' not found` });
      return;
    }
    res.json({ success: true, data: center });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || "Failed to fetch recycling center" });
  }
}

export async function createCenter(req: Request, res: Response) {
  try {
    const { name, location, acceptedMaterials, phone, openingHours } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      res.status(400).json({ success: false, error: "Recycling center 'name' is required." });
      return;
    }
    if (!location || typeof location !== "string" || !location.trim()) {
      res.status(400).json({ success: false, error: "Recycling center 'location' is required." });
      return;
    }
    if (!phone || typeof phone !== "string" || !phone.trim()) {
      res.status(400).json({ success: false, error: "Recycling center 'phone' is required." });
      return;
    }
    if (!openingHours || typeof openingHours !== "string" || !openingHours.trim()) {
      res.status(400).json({ success: false, error: "Recycling center 'openingHours' is required." });
      return;
    }

    let materialsArray: string[] = [];
    if (Array.isArray(acceptedMaterials)) {
      materialsArray = acceptedMaterials.map((m) => String(m).trim()).filter(Boolean);
    } else if (typeof acceptedMaterials === "string" && acceptedMaterials.trim()) {
      materialsArray = acceptedMaterials.split(",").map((m) => m.trim()).filter(Boolean);
    }

    if (materialsArray.length === 0) {
      res.status(400).json({ success: false, error: "At least one accepted material must be provided in 'acceptedMaterials'." });
      return;
    }

    const created = await DataStore.createRecyclingCenter({
      name: name.trim(),
      location: location.trim(),
      acceptedMaterials: materialsArray,
      phone: phone.trim(),
      openingHours: openingHours.trim(),
    });

    res.status(201).json({ success: true, data: created, message: "Recycling center added successfully." });
  } catch (error: any) {
    console.error("Error creating recycling center:", error);
    res.status(500).json({ success: false, error: error?.message || "Failed to create recycling center" });
  }
}

export async function updateCenter(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, location, acceptedMaterials, phone, openingHours } = req.body;

    const updatePayload: any = {};
    if (name !== undefined) updatePayload.name = String(name).trim();
    if (location !== undefined) updatePayload.location = String(location).trim();
    if (phone !== undefined) updatePayload.phone = String(phone).trim();
    if (openingHours !== undefined) updatePayload.openingHours = String(openingHours).trim();

    if (acceptedMaterials !== undefined) {
      if (Array.isArray(acceptedMaterials)) {
        updatePayload.acceptedMaterials = acceptedMaterials.map((m) => String(m).trim()).filter(Boolean);
      } else if (typeof acceptedMaterials === "string") {
        updatePayload.acceptedMaterials = acceptedMaterials.split(",").map((m) => m.trim()).filter(Boolean);
      }
    }

    const updated = await DataStore.updateRecyclingCenter(id, updatePayload);
    if (!updated) {
      res.status(404).json({ success: false, error: `Recycling center with id '${id}' not found` });
      return;
    }

    res.json({ success: true, data: updated, message: "Recycling center updated successfully." });
  } catch (error: any) {
    console.error("Error updating recycling center:", error);
    res.status(500).json({ success: false, error: error?.message || "Failed to update recycling center" });
  }
}

export async function deleteCenter(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await DataStore.deleteRecyclingCenter(id);
    if (!deleted) {
      res.status(404).json({ success: false, error: `Recycling center with id '${id}' not found` });
      return;
    }
    res.json({ success: true, message: "Recycling center deleted successfully." });
  } catch (error: any) {
    console.error("Error deleting recycling center:", error);
    res.status(500).json({ success: false, error: error?.message || "Failed to delete recycling center" });
  }
}
