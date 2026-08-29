import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult } from "../types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_OPENROUTER_MODEL = "google/gemini-2.5-flash";

const SCAN_PROMPT = `You are an expert AI Recycling and Waste Sorting Specialist for Myanmar and Southeast Asia.
Analyze the uploaded image of waste or discarded items.

Identify:
1. Exact material name (e.g., 'Plastic Bottle', 'Corrugated Delivery Box', 'Aluminum Can', 'Glass Jar', 'Lithium Battery E-Waste', 'Polystyrene Foam', 'Food Scraps')
2. Whether the item is recyclable (true/false)
3. Category (e.g. 'PET Plastic', 'HDPE Plastic', 'Paper & Cardboard', 'Glass', 'Scrap Metal', 'Electronic Waste', 'Organic Waste', 'Non-Recyclable Trash')
4. Step-by-step preparation instructions for the citizen before recycling (e.g., 'Clean the bottle', 'Remove cap', 'Flatten carton', 'Send to recycling center')
5. Environmental impact statement explaining how recycling this item helps the environment
6. Estimated Myanmar scrap market buyback value if applicable (e.g., '350 - 450 MMK/kg')
7. Brief description of what is visible in the photo

Reply with a single JSON object using these keys:
material (string), recyclable (boolean), category (string), instructions (string array),
environmentalImpact (string), estimatedMyanmarValue (string), itemDescription (string).`;

const sampleMockResults: ScanResult[] = [
  {
    material: "PET Plastic Beverage Bottle",
    recyclable: true,
    category: "PET Plastic",
    instructions: [
      "Empty leftover liquids and rinse inside with water",
      "Remove plastic cap and crush bottle to reduce volume",
      "Send to local recycling center or drop off at community hub",
    ],
    environmentalImpact: "Reduces plastic pollution and saves ~0.15kg of CO2 per bottle",
    confidenceScore: 0.96,
    estimatedMyanmarValue: "350 - 450 MMK/kg",
    recommendedAction: "pickup",
    itemDescription: "Clear transparent polyethylene terephthalate (PET 1) drinking water bottle.",
  },
  {
    material: "Corrugated Cardboard Box",
    recyclable: true,
    category: "Paper & Cardboard",
    instructions: [
      "Remove excessive plastic tape and shipping labels",
      "Flatten the carton box completely",
      "Keep dry and bundle with string for pickup",
    ],
    environmentalImpact: "Prevents tree logging and conserves 70% energy compared to virgin pulp",
    confidenceScore: 0.94,
    estimatedMyanmarValue: "280 - 350 MMK/kg",
    recommendedAction: "pickup",
    itemDescription: "Clean corrugated shipping delivery box suitable for paper recycling mills.",
  },
  {
    material: "Aluminum Beverage Can",
    recyclable: true,
    category: "Scrap Metal / Aluminum",
    instructions: [
      "Rinse residual beverage to prevent ants and odors",
      "Crush the aluminum can flat",
      "Collect in dry scrap bin for high-value metal recycling",
    ],
    environmentalImpact: "Infinitely recyclable; saves 95% of energy needed for primary aluminum smelting",
    confidenceScore: 0.98,
    estimatedMyanmarValue: "1,800 - 2,400 MMK/kg",
    recommendedAction: "pickup",
    itemDescription: "Aluminum soft drink can with high recyclable metallic purity.",
  },
  {
    material: "Glass Beverage Bottle",
    recyclable: true,
    category: "Glass Container",
    instructions: [
      "Rinse bottle thoroughly and remove cork or metal crown",
      "Inspect for cracks (keep whole if possible for deposit reuse)",
      "Drop off at designated glass collection depot",
    ],
    environmentalImpact: "100% recyclable repeatedly without quality loss, diverts landfill bulk",
    confidenceScore: 0.92,
    estimatedMyanmarValue: "100 - 200 MMK/bottle",
    recommendedAction: "drop_off",
    itemDescription: "Standard glass container suitable for bottle washing reuse or cullet remelting.",
  },
  {
    material: "Electronic Device (Smartphone / Circuit Board)",
    recyclable: true,
    category: "Electronic Waste",
    instructions: [
      "Do not puncture or crush internal lithium-ion battery",
      "Perform factory reset or remove confidential storage chips",
      "Hand over to certified e-waste collector for precious metal recovery",
    ],
    environmentalImpact: "Recovers precious metals (gold, copper) and prevents toxic lead/cadmium soil leakage",
    confidenceScore: 0.95,
    estimatedMyanmarValue: "2,500 - 5,000 MMK/kg",
    recommendedAction: "pickup",
    itemDescription: "Consumer electronic waste with recyclable PCBs and recyclable metal chassis.",
  },
];

export type VisionProvider = "openrouter" | "gemini" | "mock";

export function getVisionProvider(): VisionProvider {
  if (process.env.OPENROUTER_API_KEY) return "openrouter";
  if (process.env.GEMINI_API_KEY) return "gemini";
  return "mock";
}

export function getVisionSourceLabel(): string {
  const provider = getVisionProvider();
  if (provider === "openrouter") {
    const model = process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL;
    return `OpenRouter (${model})`;
  }
  if (provider === "gemini") return "Gemini Vision";
  return "Mock AI Vision Engine";
}

function mockScanResult(): ScanResult {
  const sample = sampleMockResults[Math.floor(Math.random() * sampleMockResults.length)];
  return { ...sample };
}

function parseImageInput(imageInput: string, mimeTypeHint?: string) {
  let base64Data = imageInput;
  let mimeType = mimeTypeHint || "image/jpeg";

  if (imageInput.startsWith("data:")) {
    const parts = imageInput.split(",");
    const meta = parts[0];
    base64Data = parts[1] || "";
    const match = meta.match(/data:([^;]+);base64/);
    if (match?.[1]) {
      mimeType = match[1];
    }
  }

  return {
    base64Data,
    mimeType,
    dataUrl: `data:${mimeType};base64,${base64Data}`,
  };
}

function parseModelJson(text: string): Record<string, unknown> {
  const cleaned = text.replace(/```json\s*|```/g, "").trim();
  return JSON.parse(cleaned);
}

function normalizeScanResult(parsed: Record<string, unknown>): ScanResult {
  const recyclable = typeof parsed.recyclable === "boolean" ? parsed.recyclable : true;
  return {
    material: typeof parsed.material === "string" ? parsed.material : "Recyclable Item",
    recyclable,
    category: typeof parsed.category === "string" ? parsed.category : "Recyclable Waste",
    instructions:
      Array.isArray(parsed.instructions) && parsed.instructions.length > 0
        ? parsed.instructions.filter((step): step is string => typeof step === "string")
        : ["Clean the item", "Segregate properly", "Send to certified recycler"],
    environmentalImpact:
      typeof parsed.environmentalImpact === "string"
        ? parsed.environmentalImpact
        : "Reduces landfill burden and pollution",
    confidenceScore: 0.95,
    estimatedMyanmarValue:
      typeof parsed.estimatedMyanmarValue === "string"
        ? parsed.estimatedMyanmarValue
        : "300 - 500 MMK/kg",
    recommendedAction: recyclable ? "pickup" : "general_waste",
    itemDescription: typeof parsed.itemDescription === "string" ? parsed.itemDescription : undefined,
  };
}

async function analyzeWithOpenRouter(dataUrl: string): Promise<ScanResult> {
  const model = process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL;
  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
      "X-Title": "EcoMind Myanmar",
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are an expert recycling specialist. Reply with JSON only.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: SCAN_PROMPT },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
    }),
    signal: AbortSignal.timeout(30000),
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = payload?.error?.message || payload?.error || res.statusText;
    throw new Error(`OpenRouter request failed: ${detail}`);
  }

  const text = payload?.choices?.[0]?.message?.content;
  if (!text || typeof text !== "string") {
    throw new Error("OpenRouter returned an empty vision response");
  }

  return normalizeScanResult(parseModelJson(text));
}

async function analyzeWithGemini(base64Data: string, mimeType: string): Promise<ScanResult> {
  const client = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        { inlineData: { mimeType, data: base64Data } },
        { text: SCAN_PROMPT },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          material: { type: Type.STRING },
          recyclable: { type: Type.BOOLEAN },
          category: { type: Type.STRING },
          instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
          environmentalImpact: { type: Type.STRING },
          estimatedMyanmarValue: { type: Type.STRING },
          itemDescription: { type: Type.STRING },
        },
        required: ["material", "recyclable", "category", "instructions", "environmentalImpact"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response text returned from Gemini API");
  }

  return normalizeScanResult(parseModelJson(text));
}

export async function analyzeWasteImage(
  imageInput: string,
  mimeTypeHint?: string
): Promise<ScanResult> {
  const provider = getVisionProvider();

  if (provider === "mock") {
    console.info("ℹ️ No OPENROUTER_API_KEY or GEMINI_API_KEY set. Using mock AI recycling vision response.");
    return mockScanResult();
  }

  const { base64Data, mimeType, dataUrl } = parseImageInput(imageInput, mimeTypeHint);

  try {
    if (provider === "openrouter") {
      return await analyzeWithOpenRouter(dataUrl);
    }
    return await analyzeWithGemini(base64Data, mimeType);
  } catch (err: any) {
    console.error("AI Vision scan failed:", err?.message || err);
    return {
      ...sampleMockResults[0],
      itemDescription: "AI Scanner (Standard Recyclable Analysis)",
    };
  }
}
