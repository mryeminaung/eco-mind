import React from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  Truck,
  MapPin,
  Leaf,
  RotateCcw,
  Coins,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { ScanResult } from "@/types";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { useLocale } from "@/i18n/LocaleContext";

interface ScanResultCardProps {
  result: ScanResult;
  source?: string;
  onScanAnother: () => void;
  scannedImage?: string | null;
}

export const ScanResultCard: React.FC<ScanResultCardProps> = ({
  result,
  source,
  onScanAnother,
  scannedImage,
}) => {
  const { t } = useLocale();
  const isRecyclable = result.recyclable;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
      <div
        className={`px-5 py-4 flex items-center justify-between gap-3 ${
          isRecyclable
            ? "bg-gradient-to-r from-emerald-800 to-teal-800 text-white"
            : "bg-gradient-to-r from-slate-700 to-slate-800 text-white"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center shrink-0">
            {isRecyclable ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5 text-rose-200" />}
          </span>
          <div className="min-w-0">
            <p className="font-extrabold leading-tight truncate">
              {isRecyclable ? t("scan.result.yes") : t("scan.result.no")}
            </p>
            <p className="text-xs text-white/70">{t("scan.result.network")}</p>
          </div>
        </div>
        <Badge
          variant={isRecyclable ? "success" : "destructive"}
          className="shrink-0 text-xs"
        >
          {isRecyclable ? t("scan.result.take") : t("scan.result.waste")}
        </Badge>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        <div className="flex gap-4 items-start">
          {scannedImage && (
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
              <img src={scannedImage} alt={result.material} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {result.category}
              </span>
              {result.confidenceScore && (
                <span className="text-[11px] text-emerald-700 font-semibold inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {Math.round(result.confidenceScore * 100)}%
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {result.material}
            </h2>
            {result.itemDescription && (
              <p className="text-sm text-slate-600 leading-relaxed">{result.itemDescription}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5" />
              {t("scan.result.buyback")}
            </p>
            <p className="text-sm font-extrabold text-slate-900 mt-1">
              {result.estimatedMyanmarValue || "250 – 450 MMK/kg"}
            </p>
          </div>
          <div className="rounded-2xl bg-lima-50 border border-lima-100 p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-lima-800 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5" />
              {t("scan.result.impact")}
            </p>
            <p className="text-sm font-semibold text-slate-800 mt-1 leading-snug">
              {result.environmentalImpact}
            </p>
          </div>
        </div>

        {result.instructions?.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold text-slate-900">{t("scan.result.prep")}</h3>
            <ol className="space-y-2">
              {result.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {source && (
          <p className="text-[11px] text-slate-400 flex items-center gap-1 pt-1 border-t border-slate-100">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            {source}
          </p>
        )}
      </div>

      <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
        <Button variant="outline" size="sm" className="gap-2" onClick={onScanAnother}>
          <RotateCcw className="w-3.5 h-3.5" />
          {t("scan.result.another")}
        </Button>
        <div className="flex-1 flex flex-col sm:flex-row gap-2 sm:justify-end">
          {isRecyclable ? (
            <>
              <Link to="/centers" className="flex-1 sm:flex-initial">
                <Button variant="outline" size="sm" className="w-full gap-1.5 border-emerald-200 text-emerald-800">
                  <MapPin className="w-3.5 h-3.5" />
                  {t("scan.result.centers")}
                </Button>
              </Link>
              <Link
                to={`/request-pickup?material=${encodeURIComponent(result.material || result.category)}`}
                className="flex-1 sm:flex-initial"
              >
                <Button variant="eco" size="sm" className="w-full gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  {t("scan.result.pickup")}
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/community" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                {t("scan.result.disposal")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
