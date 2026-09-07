import { SAMPLE_ITEMS, getSampleResult } from "@/features/scanner/samples";
import { useAuth } from "@/features/auth/AuthContext";
import { loadHistory, saveHistory, makeThumbnail, type SavedScan } from "@/features/scanner/history";
import React, { useEffect, useState } from "react";
import {
  Sparkles,
  Recycle,
  Package,
  Wine,
  Cylinder,
  Cpu,
  History,
  ScanLine,
} from "lucide-react";
import { ImageUpload } from "@/features/scanner/components/ImageUpload";
import { ScannerLoadingState } from "@/features/scanner/components/ScannerLoadingState";
import { ScanResultCard } from "@/features/scanner/components/ScanResultCard";
import { api } from "@/shared/api";
import { ScanResult } from "@/types";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { PageSectionHeader } from "@/shared/components/PageSectionHeader";
import { useLocale } from "@/i18n/LocaleContext";

export const AiScannerPage: React.FC = () => {
  const { t } = useLocale();
  const { user } = useAuth();
  const historyKey = `ecomind-scans-v1:${user?.id || user?._id || "anonymous"}`;
  const [storageFailed, setStorageFailed] = useState(false);
  const categories = [
    { name: t("scan.cat.plastic"), hint: t("scan.cat.plasticHint"), icon: Recycle },
    { name: t("scan.cat.paper"), hint: t("scan.cat.paperHint"), icon: Package },
    { name: t("scan.cat.glass"), hint: t("scan.cat.glassHint"), icon: Wine },
    { name: t("scan.cat.metal"), hint: t("scan.cat.metalHint"), icon: Cylinder },
    { name: t("scan.cat.ewaste"), hint: t("scan.cat.ewasteHint"), icon: Cpu },
  ];
  const [sampleId, setSampleId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>("image/jpeg");
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [apiSource, setApiSource] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<SavedScan[]>([]);
  useEffect(() => {
    const saved = loadHistory(historyKey);
    setScanHistory(saved);
    setSelectedImage(saved[0]?.image || null);
    setScanResult(saved[0]?.result || null);
    setApiSource(saved[0]?.source);
    setSampleId(null);
    setError(null);
    setStorageFailed(false);
  }, [historyKey]);

  const handleImageSelected = async (base64: string, mimeType: string) => {
    setSampleId(null);
    setSelectedImage(base64);
    setImageMimeType(mimeType);
    setError(null);
    setScanResult(null);
    triggerScan(base64, mimeType);
  };

  const triggerScan = async (base64Data?: string, mime?: string) => {
    if (sampleId && !base64Data) return;
    const imgToScan = base64Data || selectedImage;
    const typeToScan = mime || imageMimeType;

    if (!imgToScan) {
      setError(t("scan.needImage"));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.scanWaste(imgToScan, typeToScan);
      setScanResult(response.data);
      setApiSource(response.source);
      const entry: SavedScan = {
        id: crypto.randomUUID(),
        result: response.data,
        source: response.source,
        timestamp: new Date().toLocaleString(),
        image: await makeThumbnail(imgToScan),
      };
      const next = [entry, ...scanHistory].slice(0, 8);
      setScanHistory(next);
      setStorageFailed(!saveHistory(historyKey, next));
    } catch (err: any) {
      console.error("Scan error:", err);
      const messages: Record<string, string> = {
        SCAN_IMAGE_UNCLEAR: "scan.error.unclear",
        SCAN_IMAGE_INVALID: "scan.invalidFile",
        SCAN_LOGIN: "scan.error.login",
        SCAN_CONNECTION: "scan.error.connection",
      };
      setError(t(messages[err?.code] || "scan.error.unavailable"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSampleId(null);
    setApiSource(undefined);
    setSelectedImage(null);
    setScanResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6 pb-10">
      <PageSectionHeader
        title={t("page.scan.title")}
        description={t("page.scan.description")}
        icon={Recycle}
        pills={[
          { id: "photo", label: t("page.scan.photo") },
          { id: "identify", label: t("page.scan.identify") },
          { id: "recycle", label: t("page.scan.recycle") },
        ]}
      />

      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="shrink-0 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2"
          >
            <span className="w-8 h-8 rounded-xl bg-lima-100 text-lima-800 flex items-center justify-center">
              <cat.icon className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-slate-900">{cat.name}</p>
              <p className="text-[11px] text-slate-500">{cat.hint}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 lg:gap-6 items-start">
        <div className="xl:col-span-5 min-w-0 space-y-5">
          <ImageUpload
            onImageSelected={handleImageSelected}
            isLoading={isLoading}
            selectedImage={selectedImage}
            onClear={handleClear}
          />

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-800">{t("scan.trySample")}</p>
            <p className="text-xs text-slate-500">{t("scan.sample.help")}</p>
            <div className="grid grid-cols-5 gap-2">
              {SAMPLE_ITEMS.map(sample => (
                <button key={sample.id} type="button" disabled={isLoading}
                  aria-pressed={sampleId === sample.id}
                  onClick={() => {
                    setSampleId(sample.id);
                    setSelectedImage(sample.dataUri);
                    setScanResult(getSampleResult(sample));
                    setApiSource(undefined);
                    setError(null);
                  }}
                  className={`rounded-2xl border p-2 text-center transition-colors disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600 ${sampleId === sample.id ? "border-emerald-500 bg-lima-50" : "border-slate-200 bg-white hover:bg-lima-50"}`}>
                  <span aria-hidden="true" className="block text-xl">{sample.icon}</span>
                  <span className="block text-xs font-semibold">{t(`scan.cat.${({ plastic: "plastic", cardboard: "paper", can: "metal", glass: "glass", ewaste: "ewaste" } as Record<string, string>)[sample.id]}`)}</span>
                </button>
              ))}
            </div>
          </div>

          {selectedImage && !isLoading && !scanResult && !error && (
            <Button variant="eco" className="w-full gap-2 font-bold" onClick={() => triggerScan()}>
              <Sparkles className="w-4 h-4" />
              {t("scan.analyze")}
            </Button>
          )}

          {error && (
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-rose-700 shrink-0"
                onClick={() => triggerScan()}
              >
                {t("scan.retry")}
              </Button>
            </div>
          )}
      {storageFailed && <p role="status" className="text-sm text-amber-800">{t("scan.history.unsaved")}</p>}
      {scanHistory.length > 0 && (
        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <History className="w-4 h-4 text-emerald-600" />
              {t("scan.session")}
            </h2>
            <Button variant="outline" size="sm" disabled={isLoading} onClick={() => {
              if (saveHistory(historyKey, [])) {
                setScanHistory([]);
                setStorageFailed(false);
                handleClear();
              } else setStorageFailed(true);
            }}>{t("scan.history.clear")}</Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-2 gap-3">
            {scanHistory.map((item) => (
              <button
                key={item.id}
                disabled={isLoading}
                type="button"
                onClick={() => {
                  setSampleId(null);
                  setApiSource(item.source);
                  setSelectedImage(item.image);
                  setScanResult(item.result);
                  setError(null);
                }}
                className="min-w-0 w-full text-left rounded-2xl border border-slate-200 bg-white p-2 hover:border-emerald-400 transition-colors"
              >
                <div className="h-20 rounded-xl overflow-hidden bg-slate-100 mb-2">
                  {item.image && <img src={item.image} alt={item.result.material} className="w-full h-full object-cover" />}
                </div>
                <p className="text-xs font-bold text-slate-900 truncate">{item.result.material}</p>
                <div className="flex items-center justify-between gap-1 mt-0.5">
                  <span className="text-[11px] text-slate-500 truncate">{item.timestamp}</span>
                  <Badge
                    variant={item.result.recyclable ? "success" : "destructive"}
                    className="text-[10px] px-1.5 py-0"
                  >
                    {item.result.recyclable ? t("common.yes") : t("common.no")}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
        </div>

        <div className="xl:col-span-7 min-w-0 space-y-6">
          {isLoading ? (
            <ScannerLoadingState previewImage={selectedImage} />
          ) : scanResult ? (
            <ScanResultCard
              isSample={sampleId !== null}
              result={scanResult}
              source={apiSource}
              onScanAnother={handleClear}
              scannedImage={selectedImage}
            />
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 min-h-[22rem] flex flex-col justify-center">
              <div className="w-12 h-12 rounded-2xl bg-lima-100 text-lima-800 flex items-center justify-center mb-4">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">{t("scan.empty.title")}</h3>
              <p className="text-sm text-slate-600 mt-1.5 max-w-sm leading-relaxed">
                {t("scan.empty.text")}
              </p>
              <ul className="mt-5 space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lima-500" />
                  {t("scan.empty.tip1")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lima-500" />
                  {t("scan.empty.tip2")}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lima-500" />
                  {t("scan.empty.tip3")}
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>


    </div>
  );
};
