import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Clock,
  Navigation,
  Phone,
  PhoneCall,
  Edit3,
  Trash2,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { RecyclingCenterModal } from "@/features/centers/components/RecyclingCenterModal";
import { DeleteCenterDialog } from "@/features/centers/components/DeleteCenterDialog";
import { PageSectionHeader } from "@/shared/components/PageSectionHeader";
import { RecyclingCenter } from "@/types";
import { api } from "@/shared/api";
import { useAuth } from "@/features/auth/AuthContext";
import { useLocale } from "@/i18n/LocaleContext";

export const RecyclingCenterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLocale();
  const isAdmin = user?.role === "ADMIN";

  const [center, setCenter] = useState<RecyclingCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!id) return;
    setLoading(true);
    api
      .getRecyclingCenterById(id)
      .then((data) => {
        if (!cancelled) setCenter(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const mapQuery = center
    ? encodeURIComponent(`${center.name}, ${center.location}`)
    : "";
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`;

  const handleOpenMaps = () => {
    if (!center) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${mapQuery}`, "_blank");
  };

  const handleSave = async (data: {
    name: string;
    location: string;
    acceptedMaterials: string[];
    phone: string;
    openingHours: string;
  }) => {
    if (!center) return;
    const updated = await api.updateRecyclingCenter(center.id, data);
    setCenter(updated);
  };

  const handleDelete = async (centerId: string) => {
    await api.deleteRecyclingCenter(centerId);
    navigate("/centers");
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-40 bg-slate-200 rounded-xl" />
        <div className="h-72 bg-slate-200 rounded-3xl" />
        <div className="h-40 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  if (!center) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
          <Building2 className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900">{t("centers.notFound")}</h1>
        <p className="text-sm text-slate-500">{t("centers.notFoundText")}</p>
        <Link to="/centers">
          <Button variant="outline" className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            {t("centers.back")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/centers"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-800"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("centers.all")}
      </Link>

      <PageSectionHeader
        title={center.name}
        description={center.location}
        icon={Building2}
        actions={
          isAdmin ? (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 gap-1.5"
                onClick={() => setModalOpen(true)}
              >
                <Edit3 className="w-3.5 h-3.5" />
                {t("centers.edit")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 text-rose-100 border-rose-300/30 hover:bg-rose-500/20 gap-1.5"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="w-3.5 h-3.5" />
                {t("centers.delete")}
              </Button>
            </div>
          ) : undefined
        }
      />

      <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">

        <div className="grid lg:grid-cols-5 gap-0">
          <div className="lg:col-span-3 min-h-[280px] lg:min-h-[360px] bg-slate-100">
            <iframe
              title={`Map of ${center.name}`}
              src={mapSrc}
              className="w-full h-full min-h-[280px] lg:min-h-[360px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="lg:col-span-2 p-6 space-y-5">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("centers.hours")}</p>
                  <p className="text-sm font-semibold text-slate-800">{center.openingHours}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{t("centers.phone")}</p>
                  <p className="text-sm font-semibold text-slate-900">{center.phone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {t("centers.materials")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {center.acceptedMaterials.map((mat) => (
                  <span
                    key={mat}
                    className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-50 text-emerald-800 border-emerald-200"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Button variant="eco" className="w-full gap-1.5" onClick={handleOpenMaps}>
                <Navigation className="w-4 h-4" />
                {t("hubs.maps")}
              </Button>
              <a href={`tel:${center.phone}`} className="w-full">
                <Button variant="outline" className="w-full gap-1.5">
                  <PhoneCall className="w-4 h-4" />
                  {t("centers.call")}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>

      <RecyclingCenterModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        centerToEdit={center}
        onSave={handleSave}
      />
      <DeleteCenterDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        center={center}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
};
