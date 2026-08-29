import React from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Truck,
  MapPin,
  Leaf,
  Layers,
  HelpCircle,
  RotateCcw,
  Coins,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { ScanResult } from "@/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../shared/ui/card";
import { Badge } from "../../shared/ui/badge";
import { Button } from "../../shared/ui/button";

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
  const isRecyclable = result.recyclable;

  return (
    <Card className="border border-emerald-950/15 bg-white shadow-md rounded-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Header Banner */}
      <div
        className={`px-6 py-4 border-b flex items-center justify-between ${
          isRecyclable
            ? "bg-linear-to-r from-emerald-600 to-teal-700 text-white"
            : "bg-linear-to-r from-slate-700 to-slate-800 text-white"
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isRecyclable ? (
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-rose-500/30 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-rose-300" />
            </div>
          )}
          <div>
            <h3 className="text-base font-bold leading-tight">
              {isRecyclable ? "Recyclable Material Detected" : "Non-Recyclable Item"}
            </h3>
            <p className="text-xs text-emerald-100 opacity-90">
              Verified with AI Recycling Classifier
            </p>
          </div>
        </div>

        <Badge
          variant={isRecyclable ? "success" : "destructive"}
          className="text-xs px-2.5 py-0.5 shadow-xs font-semibold"
        >
          {isRecyclable ? "Recyclable" : "General Waste"}
        </Badge>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Main Item Identification */}
        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
          {scannedImage && (
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 flex items-center justify-center shadow-xs">
              <img
                src={scannedImage}
                alt={result.material}
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                Category: {result.category}
              </span>
              {result.confidenceScore && (
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {Math.round(result.confidenceScore * 100)}% Confidence
                </span>
              )}
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {result.material}
            </h2>

            {result.itemDescription && (
              <p className="text-xs text-slate-600 leading-relaxed">
                {result.itemDescription}
              </p>
            )}
          </div>
        </div>

        {/* Highlight Values: Value & Impact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Estimated Buyback Value in Myanmar */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-amber-900 uppercase tracking-wider">
                Estimated Buyback Rate (Myanmar)
              </p>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                {result.estimatedMyanmarValue || "250 - 450 MMK/kg"}
              </p>
              <p className="text-[10px] text-amber-800 mt-0.5">
                Redeemable via local collector partners or eco-points
              </p>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/15 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wider">
                Environmental Impact
              </p>
              <p className="text-xs font-bold text-slate-900 mt-0.5 leading-snug">
                {result.environmentalImpact}
              </p>
            </div>
          </div>
        </div>

        {/* Preparation Instructions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Recommended Recycling Preparation Instructions</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">
              {result.instructions.length} Steps
            </span>
          </div>

          <div className="space-y-2.5">
            {result.instructions.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-emerald-50/30 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                  {idx + 1}
                </div>
                <div className="flex-1 text-xs text-slate-800 font-medium pt-0.5">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Model Attribution */}
        {source && (
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              Powered by {source}
            </span>
            <span>Myanmar Waste Standards v1.0</span>
          </div>
        )}
      </CardContent>

      {/* Footer Actions */}
      <CardFooter className="p-6 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          className="w-full sm:w-auto gap-2 text-xs"
          onClick={onScanAnother}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Scan Another Waste Item</span>
        </Button>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isRecyclable ? (
            <>
              <Link to="/centers" className="flex-1 sm:flex-initial">
                <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 border-emerald-200 text-emerald-800 hover:bg-emerald-50">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Find Recycling Center</span>
                </Button>
              </Link>
              <Link
                to={`/request-pickup?material=${encodeURIComponent(result.material || result.category)}`}
                className="flex-1 sm:flex-initial"
              >
                <Button variant="eco" size="sm" className="w-full text-xs gap-1.5 shadow-xs">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Request Pickup</span>
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/community" className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>View Disposal Guide</span>
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
