import React, { useRef, useState } from "react";
import { UploadCloud, Camera, Image as ImageIcon, RefreshCw, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useLocale } from "@/i18n/LocaleContext";

interface ImageUploadProps {
  onImageSelected: (base64: string, mimeType: string, fileName?: string) => void;
  isLoading: boolean;
  selectedImage: string | null;
  onClear: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelected,
  isLoading,
  selectedImage,
  onClear,
}) => {
  const { t } = useLocale();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (isLoading) return;
    setUploadError(null);
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadError(t("scan.invalidFile"));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError(t("scan.tooLarge"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => setUploadError(t("scan.readError"));
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
      {uploadError && <p role="alert" className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{uploadError}</p>}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
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
        accept="image/jpeg,image/png,image/webp"
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
        <div className="relative aspect-[4/3] min-h-[18rem] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800">
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

    </div>
  );
};
