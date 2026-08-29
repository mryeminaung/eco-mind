import React from "react";
import { Link } from "react-router-dom";
import { MapPin, ArrowRight, Building2 } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { RecyclingCenter } from "@/types";
import { useLocale } from "@/i18n/LocaleContext";

interface RecyclingCenterCardProps {
  center: RecyclingCenter;
  view?: "card" | "list";
}

export const RecyclingCenterCard: React.FC<RecyclingCenterCardProps> = ({
  center,
  view = "card",
}) => {
  const { t } = useLocale();
  const previewCount = view === "list" ? 4 : 3;
  const previewMaterials = center.acceptedMaterials.slice(0, previewCount);
  const extraCount = center.acceptedMaterials.length - previewMaterials.length;
  const centerId = center.id || center._id || "";
  const isList = view === "list";

  return (
    <Link to={`/centers/${centerId}`} className="block h-full">
      <Card
        id={`center-card-${centerId}`}
        className="h-full overflow-hidden border border-slate-200/80 bg-white rounded-3xl hover:border-emerald-400/70 transition-all duration-200 shadow-sm hover:shadow-lg group"
      >
        <div className={isList ? "p-4 sm:p-5 flex items-center gap-4" : "p-5 sm:p-6 space-y-4"}>
          <div className={`flex items-start gap-3 min-w-0 ${isList ? "flex-1" : ""}`}>
            <span className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h3 className="font-extrabold text-slate-900 text-lg leading-tight group-hover:text-emerald-800 truncate">
                {center.name}
              </h3>
              <p className="text-xs text-slate-500 flex items-start gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className={isList ? "line-clamp-1" : "line-clamp-2"}>{center.location}</span>
              </p>
            </div>
          </div>

          <div className={`flex flex-wrap gap-1.5 ${isList ? "hidden sm:flex max-w-md justify-end" : ""}`}>
            {previewMaterials.map((mat) => (
              <span
                key={mat}
                className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium border bg-slate-50 text-slate-700 border-slate-200"
              >
                {mat}
              </span>
            ))}
            {extraCount > 0 && (
              <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-white text-slate-500 border border-slate-200">
                {t("centers.more", { count: extraCount })}
              </span>
            )}
          </div>

          <span className={`inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 group-hover:gap-1.5 transition-all shrink-0 ${isList ? "" : ""}`}>
            {t("centers.viewDetails")}
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
};
