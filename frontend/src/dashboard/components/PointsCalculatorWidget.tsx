import React, { useState, useMemo } from "react";
import { Calculator, Sparkles, Scale, Leaf, ArrowRight, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Input } from "../../shared/ui/input";
import { calculateGreenPoints, MATERIAL_RATES } from "@/shared/pointsCalculator";
import { Link } from "react-router-dom";

export const PointsCalculatorWidget: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<"plastic" | "paper" | "glass" | "metal">("plastic");
  const [weightInput, setWeightInput] = useState<string>("5");

  const calculation = useMemo(() => {
    const w = parseFloat(weightInput) || 0;
    return calculateGreenPoints(selectedCategory, `${w} kg`);
  }, [selectedCategory, weightInput]);

  return (
    <Card className="border border-emerald-200/80 bg-gradient-to-br from-emerald-50/40 via-white to-slate-50/60 shadow-sm">
      <CardHeader className="p-5 border-b border-emerald-100/70 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center shadow-2xs">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Green Points & Impact Estimator
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Calculate real-time points and landfill diversion before requesting pickup
              </CardDescription>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-1 rounded-full border border-emerald-200">
            Interactive
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Step 1: Select Material Type */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            1. Select Material Type
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "plastic", label: "Plastic", rate: "10 pts/kg", icon: "🧴" },
              { id: "paper", label: "Paper / Box", rate: "5 pts/kg", icon: "📦" },
              { id: "glass", label: "Glass", rate: "8 pts/kg", icon: "🍾" },
              { id: "metal", label: "Metal Cans", rate: "15 pts/kg", icon: "🥫" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedCategory(m.id as any)}
                className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  selectedCategory === m.id
                    ? "border-emerald-600 bg-emerald-50 text-emerald-950 shadow-2xs ring-1 ring-emerald-500"
                    : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xl">{m.icon}</span>
                  {selectedCategory === m.id && (
                    <span className="w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold">{m.label}</span>
                <span className="text-[10px] font-semibold text-emerald-700 mt-0.5">{m.rate}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Weight Input & Presets */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Estimated Weight (Kilograms)
            </label>
            <div className="flex gap-1">
              {["2", "5", "10", "20"].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWeightInput(w)}
                  className={`text-[11px] px-2 py-0.5 rounded-md border font-medium transition-colors ${
                    weightInput === w
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {w}kg
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Input
              type="number"
              min="0.5"
              step="0.5"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              placeholder="e.g. 5"
              className="pl-3 pr-12 text-base font-bold text-slate-900 h-11 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              kg
            </span>
          </div>
        </div>

        {/* Calculation Result Hero Card */}
        <div className="p-4 rounded-2xl bg-emerald-900 text-white shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-800/80 pb-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300 block">
                Estimated Reward
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-lima-400">
                  +{calculation.pointsEarned}
                </span>
                <span className="text-sm font-bold text-emerald-100">Green Points</span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300 block">
                Formula
              </span>
              <span className="text-xs font-mono font-medium text-white">
                {calculation.weightKg} kg × {calculation.ratePerKg} pts/kg
              </span>
            </div>
          </div>

          {/* Environmental Statement Highlight */}
          <div className="flex items-start gap-2.5 pt-1">
            <div className="w-5 h-5 rounded-full bg-lima-400 text-lima-950 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              🌱
            </div>
            <p className="text-xs font-medium text-emerald-100 leading-relaxed">
              "{calculation.environmentalImpact.summaryStatement}"
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="flex justify-end pt-1">
          <Link
            to={`/request-pickup?material=${encodeURIComponent(
              selectedCategory === "plastic"
                ? "Plastic Bottles & Containers"
                : selectedCategory === "paper"
                ? "Cardboard & Paper"
                : selectedCategory === "glass"
                ? "Glass Bottles"
                : "Scrap Metal & Cans"
            )}&quantity=${encodeURIComponent(weightInput + " kg")}`}
          >
            <Button className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-2 text-xs shadow-sm">
              Create Collection Request for {weightInput || 5}kg
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
