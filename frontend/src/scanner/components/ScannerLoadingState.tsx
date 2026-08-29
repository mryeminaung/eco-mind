import React, { useEffect, useState } from "react";
import { Sparkles, Scan, CheckCircle2, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "../../shared/ui/card";

interface ScannerLoadingStateProps {
  previewImage?: string | null;
}

const ANALYSIS_STEPS = [
  "Analyzing pixel contours and surface reflection...",
  "Classifying material polymer grade (Plastic, Metal, Glass, Paper, E-Waste)...",
  "Checking Myanmar municipal recyclability and buyback rates...",
  "Generating actionable step-by-step preparation guidelines...",
];

export const ScannerLoadingState: React.FC<ScannerLoadingStateProps> = ({
  previewImage,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border border-emerald-200 bg-linear-to-b from-emerald-50/50 to-white overflow-hidden shadow-sm">
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Visual Scanner Stage */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden bg-slate-900 border-2 border-emerald-500 shadow-lg flex items-center justify-center">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Scanning visual"
                className="w-full h-full object-cover opacity-60 filter brightness-90"
              />
            ) : (
              <div className="w-full h-full bg-slate-950 flex items-center justify-center">
                <Scan className="w-16 h-16 text-emerald-400 opacity-40 animate-pulse" />
              </div>
            )}

            {/* Glowing Laser Scan Bar */}
            <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-[0_0_15px_#10b981] animate-bounce top-1/4" />

            {/* Corner Target Reticles */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-emerald-400" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-emerald-400" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-emerald-400" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-emerald-400" />

            {/* Center HUD status */}
            <div className="absolute inset-0 flex items-center justify-center bg-emerald-950/20 backdrop-blur-[1px]">
              <div className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-emerald-400/50 text-emerald-300 text-xs font-mono font-bold tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>AI VISION SCANNING</span>
              </div>
            </div>
          </div>

          {/* Progress Status Text */}
          <div className="space-y-2 max-w-md">
            <h3 className="text-lg font-bold text-slate-900 flex items-center justify-center gap-2">
              <span>Identifying Waste Material</span>
            </h3>
            <p className="text-xs text-emerald-700 font-medium h-6 transition-all duration-300 animate-pulse">
              {ANALYSIS_STEPS[currentStepIndex]}
            </p>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2">
            {ANALYSIS_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx <= currentStepIndex
                    ? "w-8 bg-emerald-600"
                    : "w-2 bg-slate-200"
                }`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
