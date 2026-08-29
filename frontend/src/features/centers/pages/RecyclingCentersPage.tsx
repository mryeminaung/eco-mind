import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Search,
  Plus,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Info,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { RecyclingCenterCard } from "@/features/centers/components/RecyclingCenterCard";
import { RecyclingCenterModal } from "@/features/centers/components/RecyclingCenterModal";
import { RecyclingCenter } from "@/types";
import { api } from "@/shared/api";
import { useAuth } from "@/features/auth/AuthContext";
import { PageSectionHeader } from "@/shared/components/PageSectionHeader";
import { useLocale } from "@/i18n/LocaleContext";

export const RecyclingCentersPage: React.FC = () => {
  const { t } = useLocale();
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "materials" | "newest">("name");
  const [view, setView] = useState<"card" | "list">("card");

  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [modalOpen, setModalOpen] = useState(false);
  const [centerToEdit, setCenterToEdit] = useState<RecyclingCenter | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchCenters = async () => {
    setLoading(true);
    try {
      const data = await api.getRecyclingCenters();
      setCenters(data);
    } catch (error) {
      console.error("Failed to fetch recycling centers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter and Sort in memory for snappy responsiveness
  const filteredAndSortedCenters = useMemo(() => {
    let result = [...centers];

    // Client-side query search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.openingHours.toLowerCase().includes(q) ||
          c.acceptedMaterials.some((m) => m.toLowerCase().includes(q))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "materials") {
        return b.acceptedMaterials.length - a.acceptedMaterials.length;
      }
      if (sortBy === "newest") {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }
      return 0;
    });

    return result;
  }, [centers, searchQuery, sortBy]);

  // Admin Actions
  const handleOpenAdd = () => {
    setCenterToEdit(null);
    setModalOpen(true);
  };

  const handleSaveCenter = async (data: {
    name: string;
    location: string;
    acceptedMaterials: string[];
    phone: string;
    openingHours: string;
  }) => {
    if (centerToEdit) {
      // Edit center
      const updated = await api.updateRecyclingCenter(centerToEdit.id, data);
      setCenters((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      showToast(`Updated "${updated.name}" successfully.`);
    } else {
      // Add new center
      const created = await api.createRecyclingCenter(data);
      setCenters((prev) => [created, ...prev]);
      showToast(`Added "${created.name}" to recycling centers.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${
            toastMessage.type === "success"
              ? "bg-emerald-800 text-white border-emerald-700"
              : "bg-rose-700 text-white border-rose-600"
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <PageSectionHeader
        title={t("page.centers.title")}
        description={t("page.centers.description")}
        icon={Building2}
        actions={
          isAdmin ? (
            <Button
              id="btn-add-new-center"
              size="sm"
              onClick={handleOpenAdd}
              className="gap-1.5 bg-lima-400 text-emerald-950 hover:bg-lima-300"
            >
              <Plus className="w-4 h-4" />
              <span>{t("centers.add")}</span>
            </Button>
          ) : undefined
        }
      />

      {/* Search, sort, and view */}
      <Card className="border border-slate-200/80 bg-white">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                id="input-search-centers"
                placeholder={t("centers.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  {t("common.clear")}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 whitespace-nowrap flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> {t("centers.sort")}
              </span>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "materials" | "newest")}
                className="h-9 min-w-[12.5rem] bg-slate-50 text-xs font-medium"
              >
                <option value="name">{t("centers.sort.name")}</option>
                <option value="materials">{t("centers.sort.materials")}</option>
                <option value="newest">{t("centers.sort.newest")}</option>
              </Select>

              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                <button
                  type="button"
                  onClick={() => setView("card")}
                  title={t("centers.cardView")}
                  className={`p-1.5 rounded-md ${view === "card" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  title={t("centers.listView")}
                  className={`p-1.5 rounded-md ${view === "list" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchCenters}
                title={t("centers.refresh")}
                className="p-2 shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Centers Grid or Loading / Empty state */}
      {loading ? (
        <div className={`animate-pulse ${view === "list" ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}`}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-200/60 rounded-2xl border border-slate-100"></div>
          ))}
        </div>
      ) : filteredAndSortedCenters.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/90 p-8 space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
            <Building2 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">{t("centers.empty.title")}</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {t("centers.empty.text")}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
              }}
              className="text-xs"
            >
              {t("common.reset")}
            </Button>
            {isAdmin && (
              <Button
                size="sm"
                onClick={handleOpenAdd}
                className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
              >
                {t("centers.add")}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className={view === "list" ? "space-y-3" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"}>
          {filteredAndSortedCenters.map((center) => (
            <RecyclingCenterCard
              key={center.id || center._id}
              center={center}
              view={view}
            />
          ))}
        </div>
      )}

      {/* Info Guide Card at bottom */}
      <Card className="border border-emerald-100 bg-emerald-50/50">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 shrink-0">
                <Info className="w-5 h-5" />
              </span>
              <div className="space-y-1">
                <h4 className="font-bold text-emerald-950 text-sm">
                  {t("centers.pickupCta")}
                </h4>
                <p className="text-xs text-emerald-800 max-w-xl">
                  {t("centers.pickupHint")}
                </p>
              </div>
            </div>

            <Link to="/request-pickup" className="shrink-0 w-full md:w-auto">
              <Button size="sm" className="w-full text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white gap-1.5">
                <span>{t("centers.bookPickup")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <RecyclingCenterModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        centerToEdit={centerToEdit}
        onSave={handleSaveCenter}
      />
    </div>
  );
};
