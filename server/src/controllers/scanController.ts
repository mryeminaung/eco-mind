import { Request, Response } from "express";
import { analyzeWasteImage, getVisionSourceLabel } from "../services/visionService";

export async function scanWaste(req: Request, res: Response) {
  try {
    const { image, mimeType } = req.body;

    if (!image || typeof image !== "string") {
      res.status(400).json({
        success: false,
        code: "SCAN_IMAGE_INVALID",
        error: "Choose a JPG, PNG or WebP photo and try again.",
      });
      return;
    }

    const dataUri = image.startsWith("data:") ? image.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/) : null;
    const rawValid = !image.startsWith("data:") && /^(?:image\/(?:jpeg|png|webp))$/.test(mimeType || "image/jpeg") && /^[A-Za-z0-9+/]+={0,2}$/.test(image);
    if ((!dataUri && !rawValid) || image.length > 14 * 1024 * 1024) {
      res.status(400).json({ success: false, code: "SCAN_IMAGE_INVALID", error: "Choose a JPG, PNG or WebP photo under 10 MB and try again." });
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
    const unclear = /Could not identify one item clearly/.test(error?.message || "");
    res.status(unclear ? 422 : 503).json({
      success: false,
      code: unclear ? "SCAN_IMAGE_UNCLEAR" : "SCAN_UNAVAILABLE",
      error: unclear
        ? "We could not recognize the item. Take a clear, well-lit photo of one item and try again."
        : "We could not scan your photo right now. Please try again in a moment.",
    });
  }
}
