import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Package,
  MapPin,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  Coins,
  Scale,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { WasteCategory, MyanmarCity, WasteItemDetail } from "@/types";
import { categoryMeta } from "@/shared/components/WasteCategoryBadge";
import { formatCurrency, formatWeight } from "@/shared/utils";
import { api } from "@/shared/api";

const townshipOptions: Record<MyanmarCity, string[]> = {
  Yangon: [
    "Kamayut",
    "Bahan",
    "Sanchaung",
    "Hlaing",
    "Yankin",
    "Mayangone",
    "Dagon",
    "Kyauktada",
    "Pabedan",
    "Latha",
    "Lanmadaw",
    "Insein",
    "Thingangyun",
    "South Okkalapa",
    "North Okkalapa",
    "Tamwe",
    "Dala",
  ],
  Mandalay: [
    "Chanayethazan",
    "Mahaaungmyay",
    "Chanmyathazi",
    "Aungmyethazan",
    "Pyigyidagun",
    "Amarapura",
  ],
  Naypyidaw: ["Zabuthiri", "Ottarathiri", "Dekkhinathiri", "Pobbathiri", "Zeyathiri"],
  Bago: ["Bago Central", "Kalyani", "Mazinn", "Ponnasu"],
  Mawlamyine: ["Strand Road", "Maung Ngan", "Sitke", "Dawei Su"],
  Taunggyi: ["Taunggyi Central", "Ayetharyar", "Shwenyaung", "Nyaungshwe"],
};

export const RequestPickupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") as WasteCategory | null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Form State
  const [selectedItems, setSelectedItems] = useState<WasteItemDetail[]>([
    {
      category: initialCat || "plastic",
      estimatedWeightKg: 5,
      description: "Clean bottles and containers",
    },
  ]);

  const [citizenName, setCitizenName] = useState("");
  const [citizenPhone, setCitizenPhone] = useState("");
  const [city, setCity] = useState<MyanmarCity>("Yangon");
  const [township, setTownship] = useState<string>("Kamayut");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState<"morning" | "afternoon" | "evening">("morning");
  const [notes, setNotes] = useState("");

  // Update township default when city changes
  const handleCityChange = (newCity: MyanmarCity) => {
    setCity(newCity);
    setTownship(townshipOptions[newCity][0]);
  };

  // Add / Remove item categories
  const handleAddItem = (category: WasteCategory) => {
    if (selectedItems.some((item) => item.category === category)) return;
    setSelectedItems((prev) => [
      ...prev,
      { category, estimatedWeightKg: 5, description: "" },
    ]);
  };

  const handleRemoveItem = (category: WasteCategory) => {
    if (selectedItems.length <= 1) return;
    setSelectedItems((prev) => prev.filter((i) => i.category !== category));
  };

  const handleUpdateWeight = (category: WasteCategory, weight: number) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.category === category ? { ...item, estimatedWeightKg: Math.max(1, weight) } : item
      )
    );
  };

  const handleUpdateDesc = (category: WasteCategory, desc: string) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.category === category ? { ...item, description: desc } : item
      )
    );
  };

  const totalWeight = selectedItems.reduce((sum, i) => sum + (i.estimatedWeightKg || 0), 0);
  const estimatedEcoPoints = totalWeight * 10;
  const estimatedRewardMmk = selectedItems.reduce((sum, item) => {
    const rateMap: Record<WasteCategory, number> = {
      plastic: 450,
      paper: 350,
      metal: 1800,
      electronic: 1500,
      glass: 180,
      organic: 0,
      textile: 250,
    };
    return sum + (item.estimatedWeightKg * (rateMap[item.category] || 300));
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName || !citizenPhone || !address) {
      alert("Please fill in your contact name, phone number, and address.");
      return;
    }

    setLoading(true);
    try {
      const created = await api.createPickup({
        citizenName,
        citizenPhone,
        city,
        township,
        address,
        items: selectedItems,
        totalEstimatedWeightKg: totalWeight,
        preferredDate,
        preferredTimeSlot,
        notes,
      });
      setSubmittedId(created.id);
    } catch (err: any) {
      alert("Failed to submit pickup request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submittedId) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <Card className="border border-emerald-300 bg-white text-center p-8 space-y-6 shadow-md">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Pickup Scheduled Successfully!
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Request Reference ID: #{submittedId.slice(-8)}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl text-left space-y-2 text-xs text-slate-600 border border-slate-100">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Citizen:</span>
              <span className="font-semibold text-slate-800">{citizenName} ({citizenPhone})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Location:</span>
              <span className="font-semibold text-slate-800">{township}, {city}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Scheduled Date:</span>
              <span className="font-semibold text-slate-800">{preferredDate} ({preferredTimeSlot.toUpperCase()})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-500">Total Recyclables:</span>
              <span className="font-bold text-emerald-800">{formatWeight(totalWeight)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Estimated Scrap Payout:</span>
              <span className="font-bold text-amber-700">{formatCurrency(estimatedRewardMmk)}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Our neighborhood collector will contact your phone before arriving. Keep your materials bagged or tied securely.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              variant="eco"
              onClick={() => navigate(`/dashboard?phone=${citizenPhone}`)}
              className="gap-2"
            >
              <span>Track in Citizen Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSubmittedId(null);
                setStep(1);
              }}
            >
              Book Another Pickup
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const allCategories: WasteCategory[] = [
    "plastic",
    "paper",
    "metal",
    "electronic",
    "glass",
    "organic",
    "textile",
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-1 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Schedule Doorstep Recycling Pickup
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Book verified collectors to pick up recyclable scrap directly from your home, condominium, or shop.
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        {[
          { num: 1, title: "Materials & Weight" },
          { num: 2, title: "Location & Contact" },
          { num: 3, title: "Schedule & Review" },
        ].map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-2 text-xs sm:text-sm font-semibold ${
              step === s.num
                ? "text-emerald-700 font-bold"
                : step > s.num
                ? "text-slate-800"
                : "text-slate-400"
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                step === s.num
                  ? "bg-emerald-600 text-white"
                  : step > s.num
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {s.num}
            </span>
            <span className="hidden sm:inline">{s.title}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: Materials & Weight */}
      {step === 1 && (
        <Card className="border border-slate-200/80 bg-white">
          <CardHeader>
            <CardTitle>Select Your Recyclable Materials</CardTitle>
            <CardDescription>
              Add the categories of waste you wish to recycle and provide approximate weights.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Category Add Pills */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Click to add more material streams:
              </label>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((cat) => {
                  const meta = categoryMeta[cat];
                  const isSelected = selectedItems.some((i) => i.category === cat);
                  const Icon = meta.icon;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => (isSelected ? handleRemoveItem(cat) : handleAddItem(cat))}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{meta.label}</span>
                      <span className="text-[10px] opacity-80">({meta.labelMy})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Items Config */}
            <div className="space-y-3 pt-2">
              {selectedItems.map((item) => {
                const meta = categoryMeta[item.category];
                const Icon = meta.icon;
                return (
                  <div
                    key={item.category}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg border ${meta.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{meta.label}</h4>
                          <span className="text-[11px] text-emerald-800 font-medium">
                            Rate: {meta.buyRate}
                          </span>
                        </div>
                      </div>
                      {selectedItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.category)}
                          className="text-xs text-rose-600 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Est. Weight (KG):
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            max="500"
                            value={item.estimatedWeightKg}
                            onChange={(e) =>
                              handleUpdateWeight(item.category, parseFloat(e.target.value) || 1)
                            }
                            className="w-28"
                          />
                          <span className="text-xs text-slate-500 font-medium">kg</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1">
                          Brief Description (Optional):
                        </label>
                        <Input
                          placeholder="e.g., flattened cardboard boxes, 2 bags of PET bottles"
                          value={item.description || ""}
                          onChange={(e) => handleUpdateDesc(item.category, e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Estimated Total Bar */}
            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-600">Total Estimated Weight: </span>
                <span className="font-bold text-slate-900 text-sm">
                  {formatWeight(totalWeight)}
                </span>
              </div>
              <div>
                <span className="text-slate-600">Est. Cash Payout: </span>
                <span className="font-bold text-emerald-800 text-sm">
                  {formatCurrency(estimatedRewardMmk)}
                </span>
              </div>
              <div>
                <span className="text-slate-600">Eco-Points: </span>
                <span className="font-bold text-teal-800 text-sm">
                  +{estimatedEcoPoints} pts
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="eco"
                onClick={() => setStep(2)}
                className="gap-2"
                disabled={totalWeight <= 0}
              >
                <span>Continue to Location</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: Location & Contact */}
      {step === 2 && (
        <Card className="border border-slate-200/80 bg-white">
          <CardHeader>
            <CardTitle>Pickup Location & Contact</CardTitle>
            <CardDescription>
              Provide your Myanmar contact and address so the nearest collector can reach you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Your Full Name / Business Name *
                </label>
                <Input
                  placeholder="e.g., U Kyaw Win or Green Cafe"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Phone Number (KBZPay / WavePay) *
                </label>
                <Input
                  placeholder="e.g., 09795888123"
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  State / Region / City *
                </label>
                <Select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value as MyanmarCity)}
                >
                  <option value="Yangon">Yangon (ရန်ကုန်)</option>
                  <option value="Mandalay">Mandalay (မန္တလေး)</option>
                  <option value="Naypyidaw">Naypyidaw (နေပြည်တော်)</option>
                  <option value="Bago">Bago (ပဲခူး)</option>
                  <option value="Mawlamyine">Mawlamyine (မော်လမြိုင်)</option>
                  <option value="Taunggyi">Taunggyi (တောင်ကြီး)</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Township (မြို့နယ်) *
                </label>
                <Select
                  value={township}
                  onChange={(e) => setTownship(e.target.value)}
                >
                  {townshipOptions[city].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Detailed Street Address, Building & Floor No. *
              </label>
              <Input
                placeholder="e.g., No. 24, 3rd Floor (Left), Sayar San Road, Near City Mart"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <Button
                variant="eco"
                onClick={() => {
                  if (!citizenName || !citizenPhone || !address) {
                    alert("Please fill in your name, phone number, and address.");
                    return;
                  }
                  setStep(3);
                }}
                className="gap-2"
              >
                <span>Continue to Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: Schedule & Review */}
      {step === 3 && (
        <Card className="border border-slate-200/80 bg-white">
          <CardHeader>
            <CardTitle>Schedule Date & Final Review</CardTitle>
            <CardDescription>
              Select your preferred pickup time and submit your request.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Preferred Pickup Date *
                </label>
                <Input
                  type="date"
                  value={preferredDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Preferred Time Window
                </label>
                <Select
                  value={preferredTimeSlot}
                  onChange={(e) => setPreferredTimeSlot(e.target.value as any)}
                >
                  <option value="morning">Morning (8:00 AM - 12:00 PM)</option>
                  <option value="afternoon">Afternoon (12:00 PM - 4:00 PM)</option>
                  <option value="evening">Evening (4:00 PM - 7:00 PM)</option>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Special Instructions for Collector (Optional)
              </label>
              <Input
                placeholder="e.g., Gate code, elevator available, please call 10 mins ahead"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Summary Review Card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">Summary Review</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                <p>
                  <span className="font-semibold text-slate-800">Citizen:</span> {citizenName} ({citizenPhone})
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Location:</span> {township}, {city}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Address:</span> {address}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Date/Time:</span> {preferredDate} ({preferredTimeSlot})
                </p>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-slate-700">
                <span>Materials: {selectedItems.map((i) => `${i.category} (~${i.estimatedWeightKg}kg)`).join(", ")}</span>
                <span className="font-bold text-emerald-800">Est. {formatCurrency(estimatedRewardMmk)}</span>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <Button
                variant="eco"
                onClick={handleSubmit}
                disabled={loading}
                className="gap-2 px-6"
              >
                {loading ? (
                  <span>Dispatching Request...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Schedule Pickup</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
