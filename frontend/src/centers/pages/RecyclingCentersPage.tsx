import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Search,
  Plus,
  ShieldAlert,
  Sparkles,
  Filter,
  CheckCircle2,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
  Info,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { RecyclingCenterCard } from "@/centers/components/RecyclingCenterCard";
import { RecyclingCenterModal } from "@/centers/components/RecyclingCenterModal";
import { DeleteCenterDialog } from "@/centers/components/DeleteCenterDialog";
import { RecyclingCenter } from "@/types";
import { api } from "@/shared/api";
import { useAuth } from "@/auth/AuthContext";

const POPULAR_FILTERS = [
  { id: "all", label: "All Materials", icon: "♻️" },
  { id: "plastic", label: "Plastic & PET", icon: "🧴" },
  { id: "paper", label: "Paper & Cardboard", icon: "📦" },
  { id: "metal", label: "Scrap Metal & Cans", icon: "🔩" },
  { id: "glass", label: "Glass Bottles", icon: "🍾" },
  { id: "electronic", label: "E-Waste & Batteries", icon: "🔌" },
  { id: "organic", label: "Organic & Compost", icon: "🌱" },
  { id: "textile", label: "Textiles & Fabrics", icon: "👕" },
];

export const RecyclingCentersPage: React.FC = () => {
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "materials" | "newest">("name");

  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [modalOpen, setModalOpen] = useState(false);
  const [centerToEdit, setCenterToEdit] = useState<RecyclingCenter | null>(null);
  const [centerToDelete, setCenterToDelete] = useState<RecyclingCenter | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchCenters = async () => {
    setLoading(true);
    try {
      const data = await api.getRecyclingCenters(selectedMaterial, searchQuery);
      setCenters(data);
    } catch (error) {
      console.error("Failed to fetch recycling centers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, [selectedMaterial]);

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

    // Material filter
    if (selectedMaterial !== "all") {
      const mLow = selectedMaterial.toLowerCase();
      result = result.filter((c) =>
        c.acceptedMaterials.some((m) => m.toLowerCase().includes(mLow) || mLow.includes(m.toLowerCase()))
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
  }, [centers, searchQuery, selectedMaterial, sortBy]);

  // Admin Actions
  const handleOpenAdd = () => {
    setCenterToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (center: RecyclingCenter) => {
    setCenterToEdit(center);
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

  const handleConfirmDelete = async (centerId: string) => {
    await api.deleteRecyclingCenter(centerId);
    setCenters((prev) => prev.filter((c) => c.id !== centerId && c._id !== centerId));
    showToast("Recycling center deleted successfully.");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Badge variant="eco" className="text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5 mr-1" />
              Recycling Center Finder
            </Badge>
            {isAdmin && (
              <Badge variant="warning" className="text-xs font-semibold animate-pulse">
                Admin Mode ON
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Recycling Centers in Myanmar
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
            Locate authorized recycling centers, scrap recovery depots, and eco-workshops near you. Filter by accepted materials, view opening hours, and get direct directions.
          </p>
        </div>

        {/* Admin Controls / Add Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isAdmin && (
            <Button
              id="btn-add-new-center"
              size="sm"
              onClick={handleOpenAdd}
              className="text-xs gap-1.5 font-semibold bg-emerald-700 hover:bg-emerald-800 text-white"
            >
              <Plus className="w-4 h-4" />
              <span>Add Recycling Center</span>
            </Button>
          )}

          <Link to="/scan">
            <Button variant="outline" size="sm" className="text-xs gap-1.5 border-emerald-200 hover:bg-emerald-50 text-emerald-800">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Scan Material First</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Admin Notice Banner if admin mode is toggled */}
      {isAdmin && (
        <div className="flex items-center justify-between p-3.5 bg-amber-50 border border-amber-200/90 rounded-2xl text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Admin Mode Enabled:</strong> You have permissions to add new centers, edit existing center details, and delete facilities.
            </span>
          </div>
          <Button
            size="sm"
            onClick={handleOpenAdd}
            className="text-xs bg-amber-700 hover:bg-amber-800 text-white shrink-0 ml-2"
          >
            + Add Center
          </Button>
        </div>
      )}

      {/* Material Filter Pill Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            Filter by Material Type:
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredAndSortedCenters.length} centers
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {POPULAR_FILTERS.map((filter) => {
            const isActive = selectedMaterial === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedMaterial(filter.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Sort Controls Toolbar */}
      <Card className="border border-slate-200/80 bg-white">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                id="input-search-centers"
                placeholder="Search centers by name, city, township, or accepted material..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 whitespace-nowrap flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="name">Alphabetical (A - Z)</option>
                <option value="materials">Most Materials Accepted</option>
                <option value="newest">Recently Added</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchCenters}
                title="Refresh centers list"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
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
            <h3 className="text-lg font-bold text-slate-900">No recycling centers found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              We couldn't find any centers matching "
              <span className="font-semibold text-slate-700">
                {searchQuery || selectedMaterial}
              </span>
              ". Try searching a different material or resetting your filters.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedMaterial("all");
                setSearchQuery("");
              }}
              className="text-xs"
            >
              Reset All Filters
            </Button>
            {isAdmin && (
              <Button
                size="sm"
                onClick={handleOpenAdd}
                className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-semibold"
              >
                + Add Center for this Material
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCenters.map((center) => (
            <RecyclingCenterCard
              key={center.id || center._id}
              center={center}
              isAdmin={isAdmin}
              onEdit={handleOpenEdit}
              onDelete={(c) => setCenterToDelete(c)}
              selectedMaterial={selectedMaterial}
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
                  Need Doorstep Scrap Pickup Instead?
                </h4>
                <p className="text-xs text-emerald-800 max-w-xl">
                  If you have bulky scrap, heavy cartons, or e-waste that is difficult to transport, schedule an on-demand verified collector to pick up recyclables at your home or office.
                </p>
              </div>
            </div>

            <Link to="/request-pickup" className="shrink-0 w-full md:w-auto">
              <Button size="sm" className="w-full text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white gap-1.5">
                <span>Book Doorstep Pickup</span>
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

      <DeleteCenterDialog
        open={Boolean(centerToDelete)}
        onOpenChange={(open) => !open && setCenterToDelete(null)}
        center={centerToDelete}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};
