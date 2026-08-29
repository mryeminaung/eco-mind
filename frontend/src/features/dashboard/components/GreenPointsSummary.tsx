import React from "react";
import { Sparkles, Award, Scale, Leaf, Package, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { UserRewardProfile } from "@/types";

interface GreenPointsSummaryProps {
  profile: UserRewardProfile | null;
  loading?: boolean;
}

export const GreenPointsSummary: React.FC<GreenPointsSummaryProps> = ({
  profile,
  loading = false,
}) => {
  if (loading || !profile) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-200/70 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  // Determine user tier based on points
  const points = profile.totalPoints || 0;
  let tier = { name: "Green Starter", color: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: "🌱" };
  if (points >= 500) {
    tier = { name: "Eco Guardian (Tier 3)", color: "bg-purple-100 text-purple-800 border-purple-300", icon: "👑" };
  } else if (points >= 250) {
    tier = { name: "Zero-Waste Hero (Tier 2)", color: "bg-blue-100 text-blue-800 border-blue-300", icon: "🌟" };
  } else if (points >= 100) {
    tier = { name: "Active Recycler (Tier 1)", color: "bg-emerald-100 text-emerald-800 border-emerald-300", icon: "🌿" };
  }

  return (
    <div className="space-y-4">
      {/* Dynamic Environmental Statement Banner */}
      {profile.environmentalImpact?.summaryStatement && (
        <div className="bg-gradient-to-r from-lima-950 via-lima-900 to-lima-950 text-white p-5 rounded-2xl shadow-sm border border-emerald-800/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-lima-400 flex items-center justify-center text-lima-950 shrink-0 mt-0.5 shadow-sm">
                <Leaf className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-lima-400">
                    Personal Recycling Statement
                  </span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-emerald-200">
                    Live Impact
                  </span>
                </div>
                <p className="text-sm sm:text-base font-bold text-white leading-snug">
                  "{profile.environmentalImpact.summaryStatement}"
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${tier.color} flex items-center gap-1.5`}>
                <span>{tier.icon}</span>
                <span>{tier.name}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4 Core Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Green Points */}
        <Card className="border border-slate-200/80 bg-white hover:border-emerald-300 transition-all shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Green Points
                </span>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-3xl font-black text-emerald-700">{profile.totalPoints}</p>
                  <span className="text-xs font-bold text-slate-500">pts</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Earned across all materials</span>
              <span className="font-semibold text-emerald-700">100% Verified</span>
            </div>
          </CardContent>
        </Card>

        {/* 2. Items Recycled Count & Total Weight */}
        <Card className="border border-slate-200/80 bg-white hover:border-emerald-300 transition-all shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Items Recycled
                </span>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-3xl font-black text-slate-900">{profile.itemsRecycledCount}</p>
                  <span className="text-xs font-semibold text-slate-500">batches</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200/60 shadow-2xs">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Total weight:</span>
              <strong className="text-slate-800">{profile.totalWeightKg} kg</strong>
            </div>
          </CardContent>
        </Card>

        {/* 3. Landfill Waste Diverted */}
        <Card className="border border-slate-200/80 bg-white hover:border-emerald-300 transition-all shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Landfill Diverted
                </span>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-3xl font-black text-emerald-800">
                    {profile.environmentalImpact?.landfillSavedKg || profile.totalWeightKg}
                  </p>
                  <span className="text-xs font-bold text-slate-500">kg</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/60 shadow-2xs">
                <Scale className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Municipal waste prevented</span>
              <span className="text-amber-700 font-semibold">1:1 Direct</span>
            </div>
          </CardContent>
        </Card>

        {/* 4. CO2 Emissions Saved */}
        <Card className="border border-slate-200/80 bg-white hover:border-emerald-300 transition-all shadow-2xs">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  CO₂ Saved
                </span>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-3xl font-black text-teal-800">
                    {profile.environmentalImpact?.co2SavedKg || 0}
                  </p>
                  <span className="text-xs font-bold text-slate-500">kg CO₂</span>
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200/60 shadow-2xs">
                <Leaf className="w-6 h-6 text-teal-600" />
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Open incineration avoided</span>
              <span className="text-teal-700 font-semibold">Clean Air</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
