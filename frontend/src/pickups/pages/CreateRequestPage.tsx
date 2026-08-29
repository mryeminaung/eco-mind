import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Package,
  MapPin,
  FileText,
  Scale,
  PlusCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Trash2,
  RefreshCw,
  Info,
  Layers,
  ArrowUpRight,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Select } from "@/shared/ui/select";
import { Badge } from "@/shared/ui/badge";
import { CollectionStatusBadge } from "@/shared/components/CollectionStatusBadge";
import { CollectionRequest, CollectionStatus } from "@/types";
import { api } from "@/shared/api";
import { calculateGreenPoints } from "@/shared/pointsCalculator";
import { useAuth } from "@/auth/AuthContext";

const QUICK_MATERIALS = [
  "Plastic (PET Bottles & Clean Containers)",
  "Cardboard & Corrugated Boxes",
  "Scrap Metal & Aluminum Cans",
  "Glass Bottles & Jars",
  "Electronic Waste (E-Waste & Cables)",
  "Paper & Magazines",
  "Organic Compost & Food Scraps",
];

const QUANTITY_PRESETS = ["5 kg", "10 kg", "15 kg", "25 kg (2-3 bags)", "50+ kg (Bulk)"];

export const CreateRequestPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMaterial = searchParams.get("material") || "";

  // User Workflow Form State
  const [material, setMaterial] = useState(initialMaterial);
  const [quantity, setQuantity] = useState("10 kg");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();
  const userId = user?.id || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successRequest, setSuccessRequest] = useState<CollectionRequest | null>(null);

  // User's existing requests list
  const [myRequests, setMyRequests] = useState<CollectionRequest[]>([]);
  const [fetchingList, setFetchingList] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  const fetchMyRequests = async () => {
    setFetchingList(true);
    try {
      const data = await api.getCollectionRequests({ userId });
      setMyRequests(data);
    } catch (err) {
      console.error("Failed to load user requests:", err);
    } finally {
      setFetchingList(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!material.trim()) {
      setError("Please select or specify a material type.");
      return;
    }
    if (!quantity.trim()) {
      setError("Please enter an estimated quantity or weight.");
      return;
    }
    if (!address.trim()) {
      setError("Please provide a pickup address.");
      return;
    }

    setLoading(true);
    try {
      const result = await api.createCollectionRequest({
        material: material.trim(),
        quantity: quantity.trim(),
        address: address.trim(),
        description: description.trim(),
      });

      setSuccessRequest(result);
      fetchMyRequests();

      // Reset form
      setDescription("");
    } catch (err: any) {
      setError(err.message || "Failed to create collection request");
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = myRequests.filter((r) => {
    if (activeFilter === "ALL") return true;
    return r.status === activeFilter;
  });

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Waste Collection Request
            </h1>
            <Badge variant="eco" className="text-xs">
              Citizen Dispatch
            </Badge>
          </div>
          <p className="text-sm text-slate-600">
            Schedule recyclable material pickups right from your doorstep across Myanmar townships.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/collector">
            <Button variant="outline" size="sm" className="text-xs gap-1.5 border-slate-300">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Switch to Recycler Workflow</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid: Request Form on Left, Citizen's Live Requests on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: User Workflow */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-lima-800 to-lima-950 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lima-400 flex items-center justify-center text-lima-950 shadow-xs">
                    <PlusCircle className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white font-bold">
                      Create Collection Request
                    </CardTitle>
                    <CardDescription className="text-emerald-200 text-xs">
                      Submit details for licensed recyclers and verified collectors to accept
                    </CardDescription>
                  </div>
                </div>
                <Badge className="bg-white/15 text-white border-white/20 text-xs">
                  Step 1 of 1
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Success Notification Alert */}
              {successRequest && (
                <div className="mb-6 bg-emerald-50 border border-emerald-300 rounded-2xl p-4.5 animate-in fade-in duration-300">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-emerald-900">
                          Pickup Request Submitted Successfully!
                        </h4>
                        <p className="text-xs text-emerald-800">
                          Request ID: <span className="font-mono font-semibold">{successRequest.id}</span> is now{" "}
                          <span className="font-bold text-amber-700">PENDING</span> and visible to nearby certified collectors.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSuccessRequest(null)}
                      className="text-xs text-emerald-700 font-semibold hover:underline"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Field 1: Material Type */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Material Type <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    id="input-material"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="e.g., Plastic Bottles, Cardboard Boxes, Metal Scrap..."
                    required
                    className="text-sm"
                  />

                  {/* Quick Select Material Pills */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-medium text-slate-500">Quick suggestions:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_MATERIALS.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setMaterial(m)}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                            material === m
                              ? "bg-emerald-700 text-white border-emerald-700 font-medium"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Field 2: Quantity */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Quantity / Estimated Weight <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="input-quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g., 15 kg, 3 large boxes, 50 bottles"
                      required
                      className="text-sm flex-1"
                    />
                  </div>
                  {/* Preset Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {QUANTITY_PRESETS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQuantity(q)}
                        className={`text-xs px-2.5 py-0.5 rounded-md border transition-colors ${
                          quantity === q
                            ? "bg-emerald-600 text-white border-emerald-600 font-medium"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Points Forecast Preview */}
                  {material && quantity && (
                    <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1.5 mt-2">
                      {(() => {
                        const preview = calculateGreenPoints(material, quantity);
                        return (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                Reward Forecast: +{preview.pointsEarned} Green Points
                              </span>
                              <span className="text-[10px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                                {preview.ratePerKg} pts/kg ({preview.materialCategory})
                              </span>
                            </div>
                            <p className="text-xs text-emerald-900 font-medium leading-snug">
                              "{preview.environmentalImpact.summaryStatement}"
                            </p>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Field 3: Pickup Address */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pickup Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <Input
                      id="input-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Building, Street Name, Township, City (e.g., No. 24 Inya Road, Kamayut, Yangon)"
                      required
                      className="text-sm pl-9"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAddress("No. 15, Inya Road, Kamayut Township, Yangon")}
                      className="text-[11px] text-emerald-700 hover:underline font-medium"
                    >
                      + Use Saved Home Address (Kamayut, Yangon)
                    </button>
                  </div>
                </div>

                {/* Field 4: Description */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Description & Special Instructions <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <Textarea
                    id="input-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details like packaging, access gate code, best pickup time, or item condition..."
                    rows={3}
                    className="text-sm resize-none"
                  />
                </div>

                {/* User Session Simulation */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-700" />
                    <span>
                      Posting as: <strong className="text-slate-900">{user?.name || "Citizen"}</strong>
                    </span>
                  </div>
                  <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Verified Citizen
                  </span>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 text-sm rounded-xl gap-2 shadow-sm"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 text-lima-400" />
                      <span>Submit Waste Collection Request</span>
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Workflow Guide Card */}
          <Card className="border-slate-200 bg-emerald-950 text-white p-5 rounded-2xl">
            <h3 className="font-bold text-sm text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-lima-400" />
              Collection Lifecycle Stages
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-400/20 text-amber-300 mb-1">
                  1. PENDING
                </span>
                <p className="text-slate-300 text-[11px]">Submitted and waiting for a recycler to claim.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-400/20 text-blue-300 mb-1">
                  2. ACCEPTED
                </span>
                <p className="text-slate-300 text-[11px]">Recycler claims and schedules pickup route.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-purple-400/20 text-purple-300 mb-1">
                  3. COLLECTED
                </span>
                <p className="text-slate-300 text-[11px]">Driver has picked up items from address.</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2.5">
                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-400/20 text-emerald-300 mb-1">
                  4. COMPLETED
                </span>
                <p className="text-slate-300 text-[11px]">Processed at center and eco-points rewarded.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Section: My Active & Past Requests */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="p-5 pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  My Collection Requests
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Track live status updates on your submitted requests
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchMyRequests}
                disabled={fetchingList}
                className="h-8 px-2 text-xs text-slate-600"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${fetchingList ? "animate-spin" : ""}`} />
              </Button>
            </CardHeader>

            {/* Filter Pills */}
            <div className="px-5 pt-3 pb-1 flex flex-wrap gap-1.5">
              {(["ALL", "PENDING", "ACCEPTED", "COLLECTED", "COMPLETED"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setActiveFilter(st)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                    activeFilter === st
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {st === "ALL" ? "All" : st}
                </button>
              ))}
            </div>

            <CardContent className="p-5 space-y-3.5">
              {fetchingList ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin mx-auto mb-2" />
                  Loading your requests...
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200 p-6">
                  <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No requests found</p>
                  <p className="text-slate-500 mt-0.5">
                    {activeFilter === "ALL"
                      ? "Create your first collection request using the form on the left."
                      : `No requests with status '${activeFilter}'.`}
                  </p>
                </div>
              ) : (
                filteredRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-all shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 font-bold block">
                          ID: {req.id}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 leading-tight">
                          {req.material}
                        </h4>
                      </div>
                      <CollectionStatusBadge status={req.status} size="sm" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium truncate">{req.quantity}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">
                          {req.createdAt
                            ? new Date(req.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : "Recent"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5 text-xs text-slate-600 bg-slate-50 p-2 rounded-xl">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <p className="line-clamp-2 text-[11px]">{req.address}</p>
                    </div>

                    {req.description && (
                      <p className="text-[11px] text-slate-500 italic bg-amber-50/60 border border-amber-100 p-2 rounded-lg">
                        "{req.description}"
                      </p>
                    )}

                    {req.recyclerId && (
                      <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1 pt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Assigned Recycler: {req.recyclerId}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
