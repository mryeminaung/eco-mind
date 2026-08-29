import { Request, Response } from "express";
import { analyzeWasteImage, getVisionSourceLabel } from "../services/visionService";

export async function scanWaste(req: Request, res: Response) {
  try {
    const { image, mimeType } = req.body;

    if (!image || typeof image !== "string") {
      res.status(400).json({
        success: false,
        error: "An image (base64 string or data URI) is required.",
      });
      return;
    }

    const result = await analyzeWasteImage(image, mimeType);

    res.json({
      success: true,
      data: result,
      source: getVisionSourceLabel(),
    });
  } catch (error: any) {
    console.error("Error in /api/scan route:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Internal server error during waste scan",
    });
  }
}
