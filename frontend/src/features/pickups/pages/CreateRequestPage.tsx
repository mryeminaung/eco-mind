import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Package,
  MapPin,
  PlusCircle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Truck,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
import { CollectionStatusBadge } from "@/shared/components/CollectionStatusBadge";
import { PageSectionHeader } from "@/shared/components/PageSectionHeader";
import { CollectionRequest, CollectionStatus } from "@/types";
import { api } from "@/shared/api";
import { calculateGreenPoints } from "@/shared/pointsCalculator";
import { useAuth } from "@/features/auth/AuthContext";
import { useLocale } from "@/i18n/LocaleContext";

const QUICK_MATERIALS = [
  "Plastic bottles",
  "Cardboard",
  "Aluminum cans",
  "Glass bottles",
  "E-waste",
  "Paper",
];

const QUANTITY_PRESETS = ["5 kg", "10 kg", "15 kg", "25 kg", "50+ kg"];

const STAGES: CollectionStatus[] = ["PENDING", "ACCEPTED", "COLLECTED", "COMPLETED"];

export const CreateRequestPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMaterial = searchParams.get("material") || "";

  const [material, setMaterial] = useState(initialMaterial);
  const [quantity, setQuantity] = useState("10 kg");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const { user } = useAuth();
  const { t } = useLocale();
  const userId = user?.id || "";

  const [modalOpen, setModalOpen] = useState(Boolean(initialMaterial));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successRequest, setSuccessRequest] = useState<CollectionRequest | null>(null);

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

    if (!material.trim() || !quantity.trim() || !address.trim()) {
      setError(t("pickup.required"));
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
      setModalOpen(false);
      setDescription("");
      fetchMyRequests();
    } catch (err: any) {
      setError(err.message || t("pickup.failed"));
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = myRequests.filter((r) => {
    if (activeFilter === "ALL") return true;
    return r.status === activeFilter;
  });

  const pointsPreview = material && quantity ? calculateGreenPoints(material, quantity) : null;

  const countByStatus = (status: CollectionStatus) =>
    myRequests.filter((r) => r.status === status).length;

  const stagePills = [
    { id: "ALL", label: t("page.status.all"), prefix: String(myRequests.length) },
    ...STAGES.map((stage) => ({
      id: stage,
      label: t(`page.status.${stage.toLowerCase()}`),
      prefix: String(countByStatus(stage)),
    })),
  ];

  return (
    <div className="space-y-6 pb-10">
      <PageSectionHeader
        title={t("page.pickup.title")}
        description={t("page.pickup.description")}
        icon={Truck}
        pills={stagePills.map((pill) => ({
          ...pill,
          active: activeFilter === pill.id,
          onClick: () => setActiveFilter(pill.id),
        }))}
        actions={
          <Button
            variant="eco"
            className="gap-2 bg-lima-400 text-emerald-950 hover:bg-lima-300"
            onClick={() => {
              setError(null);
              setModalOpen(true);
            }}
          >
            <PlusCircle className="w-4 h-4" />
            {t("pickup.new")}
          </Button>
        }
      />

      {successRequest && (
        <div className="flex items-start justify-between gap-3 rounded-2xl bg-lima-50 border border-lima-200 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-emerald-950">{t("pickup.success")}</p>
              <p className="text-sm text-emerald-800 mt-0.5">
                {t("pickup.successText", { material: successRequest.material })}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSuccessRequest(null)}
            className="text-xs font-semibold text-emerald-800 hover:underline shrink-0"
          >
            {t("common.dismiss")}
          </button>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">{t("pickup.collections")}</h2>
            <p className="text-xs text-slate-500">
              {t("pickup.count", { shown: filteredRequests.length, total: myRequests.length })}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchMyRequests} disabled={fetchingList} className="h-8 px-2">
            <RefreshCw className={`w-4 h-4 ${fetchingList ? "animate-spin" : ""}`} />
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">{t("pickup.material")}</th>
                <th className="px-5 py-3 font-semibold">{t("pickup.weight")}</th>
                <th className="px-5 py-3 font-semibold">{t("pickup.address")}</th>
                <th className="px-5 py-3 font-semibold">{t("pickup.col.date")}</th>
                <th className="px-5 py-3 font-semibold">{t("pickup.col.status")}</th>
              </tr>
            </thead>
            <tbody>
              {fetchingList ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin mx-auto mb-2" />
                    {t("pickup.loading")}
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">{t("pickup.none.title")}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {activeFilter === "ALL"
                        ? t("pickup.empty")
                        : t("pickup.nothingFilter", {
                            status: t(`page.status.${activeFilter.toLowerCase()}`),
                          })}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="border-t border-slate-100 hover:bg-slate-50/80">
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{req.material}</td>
                    <td className="px-5 py-3.5 text-slate-600">{req.quantity}</td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">{req.address}</td>
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                      {req.createdAt
                        ? new Date(req.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <CollectionStatusBadge status={req.status} size="sm" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen} className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("pickup.dialogTitle")}</DialogTitle>
          <DialogDescription>{t("pickup.dialogDesc")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl px-3 py-2">
              {error}
            </p>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t("pickup.material")} <span className="text-rose-500">*</span>
            </label>
            <Input
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder={t("pickup.materialPlaceholder")}
              required
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {QUICK_MATERIALS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMaterial(m)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    material === m
                      ? "bg-emerald-800 text-white border-emerald-800 font-semibold"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t("pickup.weight")} <span className="text-rose-500">*</span>
            </label>
            <Input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={t("pickup.weightPlaceholder")}
              required
            />
            <div className="flex flex-wrap gap-1.5">
              {QUANTITY_PRESETS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuantity(q)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    quantity === q
                      ? "bg-emerald-800 text-white border-emerald-800 font-semibold"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
            {pointsPreview && (
              <div className="rounded-2xl bg-lima-50 border border-lima-200 p-3.5 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-emerald-950">
                    {t("pickup.pointsAbout", { points: pointsPreview.pointsEarned })}
                  </p>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    {pointsPreview.ratePerKg} pts/kg · {pointsPreview.environmentalImpact.summaryStatement}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t("pickup.address")} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t("pickup.addressPlaceholder")}
                required
                className="pl-9"
              />
            </div>
            <button
              type="button"
              onClick={() => setAddress("No. 15, Inya Road, Kamayut Township, Yangon")}
              className="text-xs font-semibold text-emerald-700 hover:underline"
            >
              {t("pickup.useSample")}
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t("pickup.notes")} <span className="text-slate-400 font-normal normal-case">{t("pickup.optional")}</span>
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("pickup.notesPlaceholder")}
              rows={3}
              className="resize-none"
            />
          </div>

          <Button type="submit" variant="eco" disabled={loading} className="w-full gap-2 font-bold">
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                {t("pickup.submitting")}
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                {t("pickup.submit")}
              </>
            )}
          </Button>
        </form>
      </Dialog>
    </div>
  );
};
