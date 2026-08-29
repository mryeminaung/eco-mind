import React, { useRef, useState } from "react";
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  Sparkles,
  RefreshCw,
  X,
  FileText,
} from "lucide-react";
import { Button } from "../../shared/ui/button";
import { Card, CardContent } from "../../shared/ui/card";

interface ImageUploadProps {
  onImageSelected: (base64: string, mimeType: string, sampleLabel?: string) => void;
  isLoading: boolean;
  selectedImage: string | null;
  onClear: () => void;
}

// Curated lightweight SVG/data samples for instant 1-click testing
const SAMPLE_ITEMS = [
  {
    id: "plastic",
    name: "Plastic Bottle",
    category: "PET 1",
    icon: "🧴",
    // Clean, high quality illustrative SVG data URI representing a clear plastic bottle
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

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelected,
  isLoading,
  selectedImage,
  onClear,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (JPEG, PNG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result, file.type, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Main Upload / Preview Area */}
      {!selectedImage ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
            dragActive
              ? "border-emerald-500 bg-emerald-50/70 ring-4 ring-emerald-500/20"
              : "border-slate-300 hover:border-emerald-400 bg-white hover:bg-slate-50/50"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-slate-900">
                Upload or Drop Waste Photo
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Take a picture of plastic bottles, scrap boxes, electronics, or glass jars. Our AI Vision model will identify the material and give you recycling instructions.
              </p>
            </div>

            {/* Upload Buttons */}
            <div
              className="flex flex-wrap items-center justify-center gap-3 pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="eco"
                size="sm"
                className="gap-2 text-xs font-semibold shadow-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Browse Photo</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-xs font-semibold"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="w-4 h-4 text-emerald-600" />
                <span>Take Camera Snapshot</span>
              </Button>
            </div>

            <p className="text-[11px] text-slate-400">
              Supports JPEG, PNG, WEBP • Max 20MB
            </p>
          </div>
        </div>
      ) : (
        <Card className="border border-slate-200 bg-white overflow-hidden">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Image Preview */}
              <div className="relative w-full sm:w-48 h-48 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Waste item preview"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Action Controls */}
              <div className="flex-1 space-y-3 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Photo Loaded
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1 px-2"
                    onClick={onClear}
                    disabled={isLoading}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </Button>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Ready for AI Vision Identification
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click "Scan Waste with AI" to detect category, recyclability, and preparation rules.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs gap-1.5"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Change Image</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preset Demo Samples for Quick Testing */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Or test instantly with sample waste items:</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SAMPLE_ITEMS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              disabled={isLoading}
              onClick={() => onImageSelected(sample.dataUri, "image/svg+xml", sample.name)}
              className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-400 hover:bg-emerald-50/40 text-left transition-all text-xs group focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <span className="text-xl shrink-0">{sample.icon}</span>
              <div className="truncate">
                <p className="font-bold text-slate-800 group-hover:text-emerald-900 truncate">
                  {sample.name}
                </p>
                <p className="text-[10px] text-slate-500">{sample.category}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
