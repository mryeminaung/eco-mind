import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Camera,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Leaf,
  Info,
  HelpCircle,
  Clock,
  History,
  Trash2,
  Cpu,
  Wine,
  Package,
  CircleDot,
} from "lucide-react";
import { ImageUpload } from "@/scanner/components/ImageUpload";
import { ScannerLoadingState } from "@/scanner/components/ScannerLoadingState";
import { ScanResultCard } from "@/scanner/components/ScanResultCard";
import { api } from "@/shared/api";
import { ScanResult } from "@/types";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

export const AiScannerPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>("image/jpeg");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [apiSource, setApiSource] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<Array<{ id: string; result: ScanResult; timestamp: string; image: string }>>([]);

  const handleImageSelected = async (base64: string, mimeType: string) => {
    setSelectedImage(base64);
    setImageMimeType(mimeType);
    setError(null);
    setScanResult(null);

    // Automatically initiate scan for snappy responsive UX
    triggerScan(base64, mimeType);
  };

  const triggerScan = async (base64Data?: string, mime?: string) => {
    const imgToScan = base64Data || selectedImage;
    const typeToScan = mime || imageMimeType;

    if (!imgToScan) {
      setError("Please select or capture an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.scanWaste(imgToScan, typeToScan);
      setScanResult(response.data);
      setApiSource(response.source);

      // Save to recent session scan history
      setScanHistory((prev) => [
        {
          id: `scan-${Date.now()}`,
          result: response.data,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          image: imgToScan,
        },
        ...prev.slice(0, 7), // Keep last 8
      ]);
    } catch (err: any) {
      console.error("Scan error:", err);
      setError(err?.message || "Failed to analyze image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setScanResult(null);
    setError(null);
  };

  const supportedCategories = [
    {
      name: "Plastic",
      icon: "🧴",
      examples: "PET Bottles, HDPE Shampoo Bottles, Clean Bags",
      badge: "High Demand",
      color: "bg-blue-50 text-blue-800 border-blue-200",
    },
    {
      name: "Paper & Cardboard",
      icon: "📦",
      examples: "Delivery cartons, office paper, clean newspapers",
      badge: "Recyclable",
      color: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      name: "Glass",
      icon: "🍾",
      examples: "Beverage bottles, condiment jars, glassware",
      badge: "Returnable",
      color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      name: "Metal & Aluminum",
      icon: "🥫",
      examples: "Soft drink cans, tin cans, iron scrap, wires",
      badge: "High Buyback Value",
      color: "bg-slate-100 text-slate-800 border-slate-300",
    },
    {
      name: "Electronic Waste",
      icon: "🔌",
      examples: "Old phones, chargers, laptop circuits, batteries",
      badge: "Specialized Hubs",
      color: "bg-purple-50 text-purple-800 border-purple-200",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Hero Header */}
      <div className="text-center space-y-3 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-bold tracking-tight">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>AI Vision Material Identification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI Recycling Scanner
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
          Snap or upload a photo of any waste item. Our AI recognizes the material polymer, determines recyclability in Myanmar, and gives you instant preparation steps and estimated buyback value.
        </p>
      </div>

      {/* Main Scanner Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Upload & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border border-slate-200 shadow-sm bg-white rounded-3xl overflow-hidden">
            <CardContent className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-sm">
                    Upload Waste Photo
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Step 1 of 2</span>
              </div>

              {/* Image Upload Component */}
              <ImageUpload
                onImageSelected={handleImageSelected}
                isLoading={isLoading}
                selectedImage={selectedImage}
                onClear={handleClear}
              />

              {/* Scan Trigger Button if image loaded but not scanned */}
              {selectedImage && !isLoading && !scanResult && (
                <Button
                  variant="eco"
                  className="w-full gap-2 shadow-sm font-bold"
                  onClick={() => triggerScan()}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Item with AI Vision</span>
                </Button>
              )}

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
                  <span>{error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-rose-700"
                    onClick={() => triggerScan()}
                  >
                    Retry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Supported Categories Guide */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Supported Recycling Categories</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {supportedCategories.map((cat, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl border ${cat.color} flex items-start gap-2.5 transition-all`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{cat.icon}</span>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs">{cat.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/70 font-semibold">
                        {cat.badge}
                      </span>
                    </div>
                    <p className="text-[10px] opacity-80 leading-tight truncate">
                      {cat.examples}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Loading State or Scan Result Card */}
        <div className="lg:col-span-6 space-y-6">
          {isLoading ? (
            <ScannerLoadingState previewImage={selectedImage} />
          ) : scanResult ? (
            <ScanResultCard
              result={scanResult}
              source={apiSource}
              onScanAnother={handleClear}
              scannedImage={selectedImage}
            />
          ) : (
            /* Placeholder / Explainer Card before scan */
            <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-3xl p-8 text-center">
              <div className="max-w-sm mx-auto space-y-4 py-6">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900">
                    Awaiting Waste Photo
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Select a photo or choose a sample waste item on the left. AI Vision will detect the category, recyclability status, preparation checklist, and local Myanmar scrap market prices.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-left text-xs space-y-2">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>How it works:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
                    <li>Upload or capture a waste item photo.</li>
                    <li>AI vision extracts material texture, stamp & shape.</li>
                    <li>Get customized Myanmar recycling tips & book collection.</li>
                  </ol>
                </div>
              </div>
            </Card>
          )}

          {/* Session Scan History */}
          {scanHistory.length > 0 && (
            <Card className="border border-slate-200 bg-white rounded-3xl overflow-hidden shadow-xs">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Recent Scans in This Session</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {scanHistory.length} items scanned
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {scanHistory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedImage(item.image);
                        setScanResult(item.result);
                      }}
                      className="py-2.5 flex items-center justify-between hover:bg-slate-50 rounded-xl px-2 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                          <img
                            src={item.image}
                            alt={item.result.material}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {item.result.material}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {item.result.category} • {item.timestamp}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant={item.result.recyclable ? "success" : "destructive"}
                        className="text-[10px] px-2 py-0.5"
                      >
                        {item.result.recyclable ? "Recyclable" : "Waste"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
