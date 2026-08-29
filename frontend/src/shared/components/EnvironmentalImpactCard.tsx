import React from "react";
import { Leaf, Trees, Droplets, Scale, ShieldCheck, Flame, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { UserRewardProfile } from "@/types";

interface EnvironmentalImpactCardProps {
  profile: UserRewardProfile;
}

export const EnvironmentalImpactCard: React.FC<EnvironmentalImpactCardProps> = ({
  profile,
}) => {
  const mb = profile.materialBreakdown || {
    plasticKg: 0,
    paperKg: 0,
    glassKg: 0,
    metalKg: 0,
    otherKg: 0,
  };
  const pb = profile.pointsBreakdown || {
    plasticPoints: 0,
    paperPoints: 0,
    glassPoints: 0,
    metalPoints: 0,
    otherPoints: 0,
  };
  const impact = profile.environmentalImpact || {
    landfillSavedKg: 0,
    co2SavedKg: 0,
    treesSaved: 0,
    waterSavedLiters: 0,
    summaryStatement: "",
  };

  const totalKg = profile.totalWeightKg || 1;

  const materials = [
    {
      name: "Plastic",
      rate: "10 pts/kg",
      kg: mb.plasticKg,
      pts: pb.plasticPoints,
      color: "bg-amber-500",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      pct: Math.round((mb.plasticKg / totalKg) * 100) || 0,
    },
    {
      name: "Paper / Cardboard",
      rate: "5 pts/kg",
      kg: mb.paperKg,
      pts: pb.paperPoints,
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      pct: Math.round((mb.paperKg / totalKg) * 100) || 0,
    },
    {
      name: "Glass",
      rate: "8 pts/kg",
      kg: mb.glassKg,
      pts: pb.glassPoints,
      color: "bg-emerald-500",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      pct: Math.round((mb.glassKg / totalKg) * 100) || 0,
    },
    {
      name: "Metal Scrap",
      rate: "15 pts/kg",
      kg: mb.metalKg,
      pts: pb.metalPoints,
      color: "bg-purple-500",
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      pct: Math.round((mb.metalKg / totalKg) * 100) || 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Environmental Impact Deep Dive */}
      <Card className="lg:col-span-7 border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Environmental Impact Breakdown
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Calculated ecological footprint reduction from your completed collections
                </CardDescription>
              </div>
            </div>
            <Badge variant="eco" className="text-xs">
              Verified Metrics
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-6">
          {/* Main 3 Impact Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-800">
                <Scale className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">Landfill Saved</span>
              </div>
              <p className="text-2xl font-black text-emerald-950">{impact.landfillSavedKg} kg</p>
              <p className="text-[11px] text-emerald-700 leading-snug">
                100% diverted from Yangon & Mandalay dumpsites.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/70 space-y-1.5">
              <div className="flex items-center gap-2 text-teal-800">
                <Flame className="w-4 h-4 text-teal-600 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">CO₂ Avoided</span>
              </div>
              <p className="text-2xl font-black text-teal-950">{impact.co2SavedKg} kg</p>
              <p className="text-[11px] text-teal-700 leading-snug">
                Prevented toxic open burning & greenhouse emissions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/70 space-y-1.5">
              <div className="flex items-center gap-2 text-blue-800">
                <Droplets className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">Water Saved</span>
              </div>
              <p className="text-2xl font-black text-blue-950">{impact.waterSavedLiters} L</p>
              <p className="text-[11px] text-blue-700 leading-snug">
                Industrial processing water conserved through virgin pulp reduction.
              </p>
            </div>
          </div>

          {/* Trees preserved block if paper recycled */}
          {impact.treesSaved > 0 && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-900 text-white shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-lima-400 text-lima-950 flex items-center justify-center font-bold">
                  <Trees className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    ~{impact.treesSaved} Trees Equivalent Conserved
                  </h4>
                  <p className="text-[11px] text-emerald-200">
                    Calculated from {mb.paperKg}kg of recycled paper and corrugated cardboard.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-lima-400 bg-white/10 px-2.5 py-1 rounded-lg">
                Forest Hero
              </span>
            </div>
          )}

          {/* Visual Breakdown Bar */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
              <span>Recycled Volume by Material Share</span>
              <span className="text-slate-500 font-normal">{profile.totalWeightKg} kg Total</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
              {materials.map((m) => (
                <div
                  key={m.name}
                  className={`${m.color} h-full transition-all duration-500`}
                  style={{ width: `${m.pct}%` }}
                  title={`${m.name}: ${m.kg}kg (${m.pct}%)`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-3 pt-1 text-[11px] text-slate-600">
              {materials.map((m) => (
                <div key={m.name} className="flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${m.color}`} />
                  <span>
                    {m.name}: <strong className="text-slate-900">{m.kg} kg</strong> ({m.pts} pts)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Column: Green Points Rates & Material Rules */}
      <Card className="lg:col-span-5 border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-slate-900">
                Green Points Rate Card
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-[11px] bg-white">
              Official Tariff
            </Badge>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Fixed reward rates applied automatically upon request completion
          </CardDescription>
        </CardHeader>

        <CardContent className="p-5 space-y-3">
          {materials.map((m) => (
            <div
              key={m.name}
              className={`p-3 rounded-xl border ${m.borderColor} ${m.bgColor} flex items-center justify-between transition-all`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${m.color}`} />
                  <h4 className="text-xs font-bold text-slate-900">{m.name}</h4>
                </div>
                <span className="text-[11px] text-slate-500 pl-4 block">
                  User recycled: <strong className="text-slate-800">{m.kg} kg</strong>
                </span>
              </div>
              <div className="text-right">
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg bg-white border ${m.borderColor} ${m.textColor} inline-block shadow-2xs`}>
                  {m.rate}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                  {m.pts} pts total
                </span>
              </div>
            </div>
          ))}

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              Points are credited automatically when a recycler marks your collection as{" "}
              <strong className="text-emerald-700">COMPLETED</strong>. Redeemable for community perks!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
