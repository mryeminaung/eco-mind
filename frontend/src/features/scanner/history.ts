import type { ScanResult } from "@/types";

export interface SavedScan {
  id: string;
  result: ScanResult;
  timestamp: string;
  image: string;
  source?: string;
}

export function loadHistory(key: string): SavedScan[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    if (!Array.isArray(value)) return [];
    return value.filter(item => typeof item?.id === "string" &&
      typeof item.timestamp === "string" && typeof item.image === "string" &&
      (item.image === "" || item.image.startsWith("data:image/jpeg;base64,")) &&
      typeof item.result?.material === "string" && typeof item.result?.category === "string" &&
      typeof item.result?.recyclable === "boolean" && typeof item.result?.environmentalImpact === "string" &&
      Array.isArray(item.result?.instructions) && item.result.instructions.every((step: unknown) => typeof step === "string") &&
      (item.source === undefined || typeof item.source === "string")).slice(0, 8);
  } catch { return []; }
}

export function saveHistory(key: string, entries: SavedScan[]): boolean {
  try {
    if (entries.length) localStorage.setItem(key, JSON.stringify(entries.slice(0, 8)));
    else localStorage.removeItem(key);
    return true;
  } catch { return false; }
}

// Keep browser storage small; original uploads are only sent for the live scan.
export function makeThumbnail(dataUrl: string): Promise<string> {
  return new Promise(resolve => {
    const image = new Image();
    image.onerror = () => resolve("");
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, 480 / Math.max(image.width, image.height));
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        const context = canvas.getContext("2d");
        if (!context) return resolve("");
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      } catch { resolve(""); }
    };
    image.src = dataUrl;
  });
}
