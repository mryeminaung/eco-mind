import { Request, Response } from "express";
import { DataStore } from "../data/store";
import { calculateGreenPoints, MATERIAL_RATES } from "../utils/pointsCalculator";

export function getRates(_req: Request, res: Response) {
  return res.json({
    success: true,
    data: {
      rates: MATERIAL_RATES,
      rules: [
        { material: "Plastic", pointsPerKg: 10, description: "PET bottles, HDPE containers, clean poly bags" },
        { material: "Paper", pointsPerKg: 5, description: "Cardboard, office paper, newspaper, magazines" },
        { material: "Glass", pointsPerKg: 8, description: "Glass bottles, food jars, beverage containers" },
        { material: "Metal", pointsPerKg: 15, description: "Aluminum cans, copper wiring, scrap steel, tin" },
      ],
    },
  });
}

export async function getUserProfile(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    if (req.user?.role === "USER" && userId !== req.user.id) {
      return res.status(403).json({ success: false, error: "You can only view your own points" });
    }
    const profile = await DataStore.getUserRewardProfile(userId || req.user?.id || "usr-maythiri");
    return res.json({ success: true, data: profile });
  } catch (error: any) {
    console.error("Error fetching user reward profile:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch user rewards" });
  }
}

export function calculatePoints(req: Request, res: Response) {
  try {
    const { material, quantity } = req.body;
    if (!material || !quantity) {
      return res.status(400).json({ success: false, error: "Material and quantity are required" });
    }
    const result = calculateGreenPoints(material, quantity);
    return res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error calculating reward points:", error);
    return res.status(500).json({ success: false, error: "Failed to calculate points" });
  }
}

export async function awardPoints(req: Request, res: Response) {
  try {
    const { requestId, userId, material, quantity } = req.body;
    if (!material || !quantity) {
      return res.status(400).json({ success: false, error: "Material and quantity are required" });
    }

    const tx = await DataStore.awardPointsForRequest({
      id: requestId || `manual-${Date.now()}`,
      userId: userId || req.user?.id || "usr-maythiri",
      material,
      quantity,
      address: "Direct Drop-off",
      status: "COMPLETED",
      recyclerId: "rec-1",
    });

    const updatedProfile = await DataStore.getUserRewardProfile(userId || "usr-maythiri");

    return res.status(201).json({
      success: true,
      message: `Awarded ${tx.pointsEarned} Green Points!`,
      data: { transaction: tx, profile: updatedProfile },
    });
  } catch (error: any) {
    console.error("Error awarding green points:", error);
    return res.status(500).json({ success: false, error: "Failed to award points" });
  }
}
