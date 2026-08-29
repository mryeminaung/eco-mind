import React, { useRef, useState } from "react";
import { UploadCloud, Camera, Image as ImageIcon, Sparkles, RefreshCw, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useLocale } from "@/i18n/LocaleContext";

interface ImageUploadProps {
  onImageSelected: (base64: string, mimeType: string, sampleLabel?: string) => void;
  isLoading: boolean;
  selectedImage: string | null;
  onClear: () => void;
}

const SAMPLE_ITEMS = [
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

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelected,
  isLoading,
  selectedImage,
  onClear,
}) => {
  const { t } = useLocale();
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert(t("scan.invalidFile"));
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
    <div className="space-y-3">
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

      {!selectedImage ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative min-h-[22rem] rounded-3xl border-2 border-dashed overflow-hidden cursor-pointer transition-all ${
            dragActive
              ? "border-lima-400 bg-lima-50 ring-4 ring-lima-400/20"
              : "border-slate-200 bg-slate-950 hover:border-emerald-400"
          }`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(133,228,55,0.12),transparent_55%)] pointer-events-none" />
          <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-lima-400/80 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-lima-400/80 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-lima-400/80 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-lima-400/80 rounded-br-lg" />

          <div className="relative z-10 min-h-[22rem] flex flex-col items-center justify-center text-center px-6 py-8 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 text-lima-300 flex items-center justify-center">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-white">{t("scan.dropTitle")}</h3>
              <p className="text-sm text-emerald-100/70 max-w-xs">
                {t("scan.dropSub")}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="eco"
                size="sm"
                className="gap-2 font-semibold"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="w-4 h-4" />
                {t("scan.browse")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 font-semibold bg-white/10 text-white border-white/20 hover:bg-white/20"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="w-4 h-4" />
                {t("scan.camera")}
              </Button>
            </div>
            <p className="text-[11px] text-emerald-200/50">{t("scan.formats")}</p>
          </div>
        </div>
      ) : (
        <div className="relative min-h-[22rem] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800">
          <img
            src={selectedImage}
            alt="Waste item preview"
            className="absolute inset-0 w-full h-full object-contain"
          />
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-lima-300 bg-slate-950/70 border border-white/10 px-2.5 py-1 rounded-full">
              {isLoading ? t("scan.scanning") : t("scan.photoReady")}
            </span>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-white/90 text-slate-800 border-0 gap-1.5"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {t("scan.change")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 bg-white/90 text-rose-700 hover:bg-rose-50 gap-1"
                onClick={onClear}
                disabled={isLoading}
              >
                <X className="w-3.5 h-3.5" />
                {t("scan.remove")}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          {t("scan.trySample")}
        </p>
        <div className="grid grid-cols-5 gap-2">
          {SAMPLE_ITEMS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              disabled={isLoading}
              onClick={() => onImageSelected(sample.dataUri, "image/svg+xml", sample.name)}
              className="rounded-2xl border border-slate-200 bg-white p-2 text-center hover:border-emerald-400 hover:bg-lima-50 transition-colors disabled:opacity-50"
              title={sample.name}
            >
              <span className="block text-xl leading-none mb-1">{sample.icon}</span>
              <span className="block text-[10px] font-bold text-slate-700 truncate">{sample.category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
