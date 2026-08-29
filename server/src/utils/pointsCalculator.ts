export type MaterialCategory = "plastic" | "paper" | "glass" | "metal" | "other";

export interface PointsCalculationResult {
  materialCategory: MaterialCategory;
  materialName: string;
  weightKg: number;
  ratePerKg: number;
  pointsEarned: number;
  environmentalImpact: {
    landfillSavedKg: number;
    co2SavedKg: number;
    treesSaved: number;
    waterSavedLiters: number;
    summaryStatement: string;
  };
}

/**
 * Material points rates as specified:
 * Plastic: 10 points/kg
 * Paper: 5 points/kg
 * Glass: 8 points/kg
 * Metal: 15 points/kg
 */
export const MATERIAL_RATES: Record<MaterialCategory, { rate: number; label: string; co2Factor: number }> = {
  plastic: { rate: 10, label: "Plastic", co2Factor: 1.8 },
  paper: { rate: 5, label: "Paper", co2Factor: 1.3 },
  glass: { rate: 8, label: "Glass", co2Factor: 0.35 },
  metal: { rate: 15, label: "Metal", co2Factor: 4.2 },
  other: { rate: 8, label: "Recyclables", co2Factor: 1.5 },
};

/**
 * Extracts numeric weight in kilograms from quantity string
 * e.g. "12 kg", "25kg (3 bags)", "5 kg", "30 bottles (approx 15 kg)", "10"
 */
export function parseWeightKg(quantity: string | number): number {
  if (typeof quantity === "number") {
    return Math.max(0.5, quantity);
  }
  if (!quantity || typeof quantity !== "string") {
    return 5; // default fallback 5kg
  }

  // Look for patterns like "15.5 kg" or "15kg"
  const kgMatch = quantity.match(/([\d.]+)\s*(?:kg|kilos|kilograms)/i);
  if (kgMatch && kgMatch[1]) {
    const val = parseFloat(kgMatch[1]);
    if (!isNaN(val) && val > 0) return val;
  }

  // Look for any general numbers in the string
  const numMatch = quantity.match(/([\d.]+)/);
  if (numMatch && numMatch[1]) {
    const val = parseFloat(numMatch[1]);
    if (!isNaN(val) && val > 0) {
      // If bottles count, estimate ~0.5kg per bottle/can
      if (/bottle|can|jar/i.test(quantity)) {
        return Math.max(1, Math.round(val * 0.4));
      }
      return val;
    }
  }

  return 5; // default 5kg
}

/**
 * Determines material category from string name
 */
export function categorizeMaterial(material: string): MaterialCategory {
  if (!material || typeof material !== "string") return "other";
  const m = material.toLowerCase();

  if (m.includes("plastic") || m.includes("pet") || m.includes("hdpe") || m.includes("pvc") || m.includes("poly")) {
    return "plastic";
  }
  if (m.includes("paper") || m.includes("cardboard") || m.includes("carton") || m.includes("box") || m.includes("newspaper") || m.includes("magazine")) {
    return "paper";
  }
  if (m.includes("glass") || m.includes("bottle") || m.includes("jar")) {
    return "glass";
  }
  if (m.includes("metal") || m.includes("aluminum") || m.includes("steel") || m.includes("copper") || m.includes("tin") || m.includes("can") || m.includes("scrap")) {
    return "metal";
  }

  return "other";
}

/**
 * Calculates Green Points and Environmental Impact
 */
export function calculateGreenPoints(
  material: string,
  quantity: string | number
): PointsCalculationResult {
  const category = categorizeMaterial(material);
  const weightKg = parseWeightKg(quantity);
  const rateConfig = MATERIAL_RATES[category];
  const ratePerKg = rateConfig.rate;

  const pointsEarned = Math.round(weightKg * ratePerKg);

  // Environmental impact calculations
  const landfillSavedKg = Number(weightKg.toFixed(1));
  const co2SavedKg = Number((weightKg * rateConfig.co2Factor).toFixed(1));
  const treesSaved = category === "paper" ? Number((weightKg * 0.017).toFixed(2)) : 0;
  const waterSavedLiters = Number((weightKg * (category === "paper" ? 26 : category === "plastic" ? 15 : 5)).toFixed(1));

  const summaryStatement = `You recycled ${weightKg}kg ${rateConfig.label.toLowerCase()} and saved approximately ${landfillSavedKg}kg of waste from landfill.`;

  return {
    materialCategory: category,
    materialName: material,
    weightKg,
    ratePerKg,
    pointsEarned,
    environmentalImpact: {
      landfillSavedKg,
      co2SavedKg,
      treesSaved,
      waterSavedLiters,
      summaryStatement,
    },
  };
}
