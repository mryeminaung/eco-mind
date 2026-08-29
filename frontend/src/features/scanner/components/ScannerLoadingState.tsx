import React, { useEffect, useState } from "react";
import { Sparkles, Scan } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";

interface ScannerLoadingStateProps {
  previewImage?: string | null;
}

export const ScannerLoadingState: React.FC<ScannerLoadingStateProps> = ({
  previewImage,
}) => {
  const { t } = useLocale();
  const analysisSteps = [t("scan.step1"), t("scan.step2"), t("scan.step3"), t("scan.step4")];
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < analysisSteps.length - 1 ? prev + 1 : prev));
    }, 900);
    return () => clearInterval(interval);
  }, [analysisSteps.length]);

  return (
    <div className="rounded-3xl border border-emerald-200 bg-white overflow-hidden min-h-[22rem] p-6 sm:p-7 flex flex-col justify-center">
      <div className="flex flex-col items-center text-center space-y-5">
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden bg-slate-950">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Scanning visual"
              className="w-full h-full object-cover opacity-50"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Scan className="w-12 h-12 text-lima-400/40 animate-pulse" />
            </div>
          )}
          <div className="absolute inset-x-3 top-1/3 h-0.5 bg-lima-400 shadow-[0_0_16px_#85e437] animate-pulse" />
          <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-lima-400" />
          <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-lima-400" />
          <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-lima-400" />
          <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-lima-400" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-lima-400/40 text-lima-300 text-[11px] font-bold tracking-wide">
              <Sparkles className="w-3 h-3 animate-spin" />
              {t("scan.scanning")}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-extrabold text-slate-900">{t("scan.identifying")}</h3>
          <p className="text-sm text-emerald-700 font-medium min-h-6">
            {analysisSteps[currentStepIndex]}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {analysisSteps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx <= currentStepIndex ? "w-7 bg-lima-500" : "w-2 bg-slate-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
