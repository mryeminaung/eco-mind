import type { ScanResult } from "@/types";

export const SAMPLE_ITEMS = [
  {
    id: "plastic",
    name: "Plastic Bottle",
    category: "PET 1",
    icon: "🧴",
    dataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23e6f4ea"/><rect x="175" y="40" width="50" height="30" rx="6" fill="%230284c7"/><rect x="185" y="70" width="30" height="25" fill="%2338bdf8"/><path d="M150 110 L250 110 C265 110 275 125 275 145 L270 330 C270 345 255 355 240 355 L160 355 C145 355 130 345 130 330 L125 145 C125 125 135 110 150 110 Z" fill="%23bae6fd" stroke="%230284c7" stroke-width="6"/><rect x="135" y="180" width="130" height="80" rx="8" fill="%23ffffff" stroke="%2338bdf8" stroke-width="3"/><text x="200" y="215" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230369a1" text-anchor="middle">PURE WATER</text><text x="200" y="240" font-family="sans-serif" font-size="12" fill="%230284c7" text-anchor="middle">500ml • PET 1</text><ellipse cx="160" cy="150" rx="10" ry="25" fill="%23ffffff" opacity="0.6"/></svg>`,
  },
  {
    id: "cardboard",
    name: "Cardboard Box",
    category: "Paper",
    icon: "📦",
    dataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23fef3c7"/><polygon points="200,60 340,130 200,200 60,130" fill="%23d97706" stroke="%2392400e" stroke-width="4"/><polygon points="60,130 200,200 200,340 60,270" fill="%23b45309" stroke="%2392400e" stroke-width="4"/><polygon points="340,130 200,200 200,340 340,270" fill="%2392400e" stroke="%2378350f" stroke-width="4"/><line x1="200" y1="60" x2="200" y2="200" stroke="%23fef08a" stroke-width="4"/><rect x="90" y="190" width="60" height="40" fill="%23ffffff" transform="rotate(-15 90 190)"/><text x="95" y="210" font-family="sans-serif" font-size="9" font-weight="bold" fill="%23000000" transform="rotate(-15 90 190)">DELIVERY BOX</text></svg>`,
  },
  {
    id: "can",
    name: "Aluminum Can",
    category: "Metal",
    icon: "🥫",
    dataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23f1f5f9"/><ellipse cx="200" cy="90" rx="60" ry="20" fill="%2394a3b8" stroke="%23475569" stroke-width="4"/><path d="M140 90 L140 310 C140 330 260 330 260 310 L260 90 Z" fill="%23ef4444" stroke="%23b91c1c" stroke-width="4"/><ellipse cx="200" cy="310" rx="60" ry="20" fill="%23cbd5e1" stroke="%23475569" stroke-width="3"/><ellipse cx="200" cy="90" rx="30" ry="10" fill="%2364748b"/><text x="200" y="210" font-family="sans-serif" font-size="22" font-weight="900" fill="%23ffffff" text-anchor="middle">SODA CAN</text><text x="200" y="240" font-family="sans-serif" font-size="12" fill="%23fee2e2" text-anchor="middle">100% RECYCLABLE</text></svg>`,
  },
  {
    id: "glass",
    name: "Glass Bottle",
    category: "Glass",
    icon: "🍾",
    dataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23ecfdf5"/><rect x="185" y="40" width="30" height="30" fill="%23047857"/><rect x="180" y="70" width="40" height="60" fill="%23059669"/><path d="M180 130 C150 170 140 190 140 220 L140 330 C140 350 260 350 260 330 L260 220 C260 190 250 170 220 130 Z" fill="%2310b981" stroke="%23047857" stroke-width="5"/><rect x="155" y="220" width="90" height="70" rx="4" fill="%23fef08a" stroke="%23ca8a04" stroke-width="2"/><text x="200" y="255" font-family="serif" font-size="14" font-weight="bold" fill="%23713f12" text-anchor="middle">GREEN GLASS</text><text x="200" y="275" font-family="sans-serif" font-size="10" fill="%23854d0e" text-anchor="middle">Returnable</text></svg>`,
  },
  {
    id: "ewaste",
    name: "E-Waste / Board",
    category: "E-Waste",
    icon: "🔌",
    dataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%230f172a"/><rect x="70" y="70" width="260" height="260" rx="16" fill="%23064e3b" stroke="%2310b981" stroke-width="5"/><rect x="150" y="150" width="100" height="100" rx="8" fill="%231e293b" stroke="%2394a3b8" stroke-width="3"/><text x="200" y="205" font-family="monospace" font-size="12" fill="%2338bdf8" text-anchor="middle">CPU CHIP</text><circle cx="105" cy="105" r="12" fill="%23eab308"/><circle cx="295" cy="105" r="12" fill="%23eab308"/><circle cx="105" cy="295" r="12" fill="%23eab308"/><circle cx="295" cy="295" r="12" fill="%23eab308"/><path d="M105 105 L150 150 M295 105 L250 150 M105 295 L150 250 M295 295 L250 250" stroke="%23eab308" stroke-width="4"/></svg>`,
  },
];

export function getSampleResult(sample: typeof SAMPLE_ITEMS[number]): ScanResult {
  const instructions: Record<string, string[]> = {
    plastic: ["Empty and rinse the bottle.", "Ask your collector whether to separate the cap.", "Keep it separate from contaminated waste."],
    cardboard: ["Remove tape and plastic packaging.", "Flatten the box and keep it dry."],
    can: ["Empty and rinse the can.", "Keep sharp edges away from hands.", "Ask your collector whether to crush it."],
    glass: ["Empty and rinse the bottle.", "Keep it intact; do not break it.", "Confirm glass acceptance with your collector."],
    ewaste: ["Do not dismantle, crush or burn the device.", "Keep it dry and separate from household waste.", "Contact an electronics collection service for handling instructions."],
  };
  return {
    material: sample.name,
    category: sample.category,
    recyclable: true,
    instructions: instructions[sample.id],
    environmentalImpact: "Reusing or correctly recycling materials can reduce waste and demand for new resources.",
    diySafe: sample.id !== "ewaste",
  };
}
