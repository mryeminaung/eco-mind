import React from "react";
import { ImpactStats } from "@/types";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { formatWeight, formatCurrency } from "@/shared/utils";
import { useLocale } from "@/i18n/LocaleContext";
import {
  Scale,
  Leaf,
  Coins,
  Truck,
  Trees,
  CheckCircle,
  Database,
} from "lucide-react";

interface Props {
  stats: ImpactStats;
  dbStatus?: { connected: boolean; type: string };
  loading?: boolean;
}

export const ImpactOverview: React.FC<Props> = ({ stats, dbStatus, loading }) => {
  const { t } = useLocale();
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-slate-200/60 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      id: "stat-kg",
      label: t("impact.kg"),
      value: formatWeight(stats.totalKgRecycled),
      subtext: t("impact.kgSub"),
      icon: Scale,
      color: "text-emerald-700 bg-emerald-100/70 border-emerald-200/50",
    },
    {
      id: "stat-co2",
      label: t("impact.co2"),
      value: `${(stats.co2SavedKg / 1000).toFixed(1)} tons`,
      subtext: t("impact.co2Sub", { trees: stats.treesEquivalent.toLocaleString() }),
      icon: Leaf,
      color: "text-teal-700 bg-teal-100/70 border-teal-200/50",
    },
    {
      id: "stat-mmk",
      label: t("impact.mmk"),
      value: formatCurrency(stats.totalMmkPaidToCitizens),
      subtext: t("impact.mmkSub"),
      icon: Coins,
      color: "text-amber-700 bg-amber-100/70 border-amber-200/50",
    },
    {
      id: "stat-pickups",
      label: t("impact.pickups"),
      value: stats.activePickups.toString(),
      subtext: t("impact.pickupsSub", { count: stats.verifiedCollectors }),
      icon: Truck,
      color: "text-sky-700 bg-sky-100/70 border-sky-200/50",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-slate-900">
            {t("impact.title")}
          </h2>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        {dbStatus && (
          <Badge variant="outline" className="text-[11px] gap-1.5 py-1 text-slate-600 bg-white">
            <Database className="w-3 h-3 text-emerald-600" />
            <span>{t("impact.backend", { type: dbStatus.type })}</span>
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.id} className="border border-slate-200/80 bg-white hover:border-emerald-300">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {item.label}
                    </p>
                    <p className="text-2xl font-black tracking-tight text-slate-900">
                      {item.value}
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>{item.subtext}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
