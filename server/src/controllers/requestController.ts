import { Request, Response } from "express";
import { DataStore } from "../data/store";
import { CollectionStatus } from "../types";

const VALID_STATUSES: CollectionStatus[] = ["PENDING", "ACCEPTED", "COLLECTED", "COMPLETED", "REJECTED"];

export async function listRequests(req: Request, res: Response) {
  try {
    const { status, userId, recyclerId, material } = req.query;
    const actor = req.user;
    const scopedUserId =
      actor?.role === "USER" ? actor.id : typeof userId === "string" ? userId : undefined;

    const requests = await DataStore.getCollectionRequests({
      status: typeof status === "string" ? status : undefined,
      userId: scopedUserId,
      recyclerId: typeof recyclerId === "string" ? recyclerId : undefined,
      material: typeof material === "string" ? material : undefined,
    });
    return res.json({ success: true, count: requests.length, data: requests });
  } catch (error: any) {
    console.error("Error fetching collection requests:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch collection requests" });
  }
}

export async function getRequest(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const item = await DataStore.getCollectionRequestById(id);
    if (!item) {
      return res.status(404).json({ success: false, error: "Collection request not found" });
    }
    if (req.user?.role === "USER" && item.userId !== req.user.id) {
      return res.status(403).json({ success: false, error: "You can only view your own collection requests" });
    }
    return res.json({ success: true, data: item });
  } catch (error: any) {
    console.error("Error fetching collection request by ID:", error);
    return res.status(500).json({ success: false, error: "Failed to retrieve collection request" });
  }
}

export async function createRequest(req: Request, res: Response) {
  try {
    const { material, quantity, address, description, recyclerId } = req.body;

    if (!material || typeof material !== "string" || !material.trim()) {
      return res.status(400).json({ success: false, error: "Material type is required" });
    }
    if (!quantity || typeof quantity !== "string" || !quantity.trim()) {
      return res.status(400).json({ success: false, error: "Quantity is required" });
    }
    if (!address || typeof address !== "string" || !address.trim()) {
      return res.status(400).json({ success: false, error: "Pickup address is required" });
    }

    const newRequest = await DataStore.createCollectionRequest({
      userId: req.user?.id || "usr-maythiri",
      recyclerId: recyclerId ? String(recyclerId).trim() : null,
      material: material.trim(),
      quantity: quantity.trim(),
      address: address.trim(),
      description: typeof description === "string" ? description.trim() : "",
      status: "PENDING",
    });

    return res.status(201).json({
      success: true,
      message: "Waste collection request created successfully",
      data: newRequest,
    });
  } catch (error: any) {
    console.error("Error creating collection request:", error);
    return res.status(500).json({ success: false, error: "Failed to create collection request" });
  }
}

export async function updateRequestStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, recyclerId } = req.body;

    if (!status || typeof status !== "string") {
      return res.status(400).json({
        success: false,
        error: "Status is required (PENDING, ACCEPTED, COLLECTED, COMPLETED, REJECTED)",
      });
    }

    const normalizedStatus = status.trim().toUpperCase() as CollectionStatus;
    if (!VALID_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status '${status}'. Must be one of: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const existing = await DataStore.getCollectionRequestById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Collection request not found" });
    }

    let assignedRecyclerId = recyclerId !== undefined ? recyclerId : existing.recyclerId;
    if (normalizedStatus === "ACCEPTED" && !assignedRecyclerId) {
      assignedRecyclerId = req.user?.id || "rec-1";
    }
    if (normalizedStatus === "REJECTED") {
      assignedRecyclerId = null;
    }

    const updated = await DataStore.updateCollectionRequestStatus(id, {
      status: normalizedStatus,
      recyclerId: assignedRecyclerId,
    });

    return res.json({
      success: true,
      message: `Request status updated to ${normalizedStatus}`,
      data: updated,
    });
  } catch (error: any) {
    console.error("Error updating collection request status:", error);
    return res.status(500).json({ success: false, error: "Failed to update request status" });
  }
}

export async function deleteRequest(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existing = await DataStore.getCollectionRequestById(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Collection request not found" });
    }
    if (req.user?.role === "USER") {
      if (existing.userId !== req.user.id) {
        return res.status(403).json({ success: false, error: "You can only delete your own requests" });
      }
      if (existing.status !== "PENDING") {
        return res.status(400).json({ success: false, error: "Only pending requests can be cancelled" });
      }
    }

    const deleted = await DataStore.deleteCollectionRequest(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Collection request not found" });
    }
    return res.json({ success: true, message: "Collection request deleted" });
  } catch (error: any) {
    console.error("Error deleting collection request:", error);
    return res.status(500).json({ success: false, error: "Failed to delete collection request" });
  }
}
