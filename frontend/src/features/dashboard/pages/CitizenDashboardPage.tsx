import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Home,
  PlusCircle,
  Truck,
  ScanLine,
  Gift,
  RefreshCw,
  Clock,
  MapPin,
  Scale,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { CollectionStatusBadge } from "@/shared/components/CollectionStatusBadge";
import { PageSectionHeader } from "@/shared/components/PageSectionHeader";
import { CollectionRequest, UserRewardProfile } from "@/types";
import { api } from "@/shared/api";
import { useAuth } from "@/features/auth/AuthContext";
import { useLocale } from "@/i18n/LocaleContext";

export const CitizenDashboardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { t } = useLocale();
  const userId = searchParams.get("userId") || user?.id || "";

  const [rewardProfile, setRewardProfile] = useState<UserRewardProfile | null>(null);
  const [collectionRequests, setCollectionRequests] = useState<CollectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setRefreshing(true);
      const [profileData, requestsData] = await Promise.all([
        api.getUserRewardProfile(userId),
        api.getCollectionRequests({ userId }),
      ]);
      setRewardProfile(profileData);
      setCollectionRequests(requestsData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const completedRequests = collectionRequests.filter((r) => r.status === "COMPLETED");
  const inProgressRequests = collectionRequests.filter((r) => r.status !== "COMPLETED");
  const recentRequests = [...collectionRequests]
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      <PageSectionHeader
        title={t("page.overview.title")}
        description={t("page.overview.description", {
          name: user?.name || rewardProfile?.name || t("page.overview.guest"),
        })}
        icon={Home}
        pills={[
          { id: "points", label: t("page.overview.points"), prefix: String(rewardProfile?.totalPoints ?? 0) },
          { id: "open", label: t("page.overview.inProgress"), prefix: String(inProgressRequests.length) },
          { id: "done", label: t("page.overview.completed"), prefix: String(completedRequests.length) },
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <Button
              size="sm"
              variant="outline"
              onClick={loadDashboardData}
              disabled={refreshing}
              className="gap-1.5 bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              {t("common.refresh")}
            </Button>
            <Link to="/request-pickup">
              <Button size="sm" className="gap-1.5 bg-lima-400 text-emerald-950 hover:bg-lima-300">
                <PlusCircle className="w-3.5 h-3.5" />
                {t("dash.createRequest")}
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: t("page.overview.points"),
            value: loading ? "—" : String(rewardProfile?.totalPoints ?? 0),
            hint: t("dash.stat.pointsHint"),
            icon: Sparkles,
          },
          {
            label: t("page.overview.inProgress"),
            value: loading ? "—" : String(inProgressRequests.length),
            hint: t("dash.stat.progressHint"),
            icon: Truck,
          },
          {
            label: t("page.overview.completed"),
            value: loading ? "—" : String(completedRequests.length),
            hint: t("dash.stat.doneHint"),
            icon: Gift,
          },
          {
            label: t("dash.stat.recycled"),
            value: loading ? "—" : `${rewardProfile?.totalWeightKg ?? 0} kg`,
            hint: t("dash.stat.itemsLogged", { count: rewardProfile?.itemsRecycledCount ?? 0 }),
            icon: Scale,
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-3xl border border-slate-200/80 bg-white p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{stat.label}</p>
              <stat.icon className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-1">{stat.hint}</p>
          </div>
        ))}
      </div>

      {rewardProfile?.environmentalImpact?.summaryStatement && (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{t("dash.impact")}</p>
            <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {rewardProfile.environmentalImpact.summaryStatement}
            </p>
          </div>
          <Link to="/rewards">
            <Button variant="outline" className="gap-1.5 shrink-0">
              {t("dash.openRewards")}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: "/scan", label: t("dash.action.scan"), text: t("dash.action.scanText"), icon: ScanLine },
          { to: "/request-pickup", label: t("dash.action.pickup"), text: t("dash.action.pickupText"), icon: Truck },
          { to: "/rewards", label: t("dash.action.rewards"), text: t("dash.action.rewardsText"), icon: Gift },
        ].map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="rounded-3xl border border-slate-200/80 bg-white p-5 hover:border-emerald-300 transition-colors"
          >
            <div className="w-10 h-10 rounded-2xl bg-lima-100 text-lima-800 flex items-center justify-center mb-3">
              <action.icon className="w-5 h-5" />
            </div>
            <p className="font-extrabold text-slate-900">{action.label}</p>
            <p className="text-sm text-slate-500 mt-1">{action.text}</p>
          </Link>
        ))}
      </div>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{t("dash.recent.eyebrow")}</p>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{t("dash.recent.title")}</h2>
          </div>
          <Link to="/request-pickup" className="text-sm font-semibold text-emerald-700 hover:underline">
            {t("common.viewAll")}
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-white border border-slate-200/80 rounded-3xl" />
            ))}
          </div>
        ) : recentRequests.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
            <Truck className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-800">{t("dash.empty.title")}</p>
            <p className="text-sm text-slate-500 mt-1 mb-4">{t("dash.empty.text")}</p>
            <Link to="/request-pickup">
              <Button variant="eco" className="gap-1.5">
                <PlusCircle className="w-4 h-4" />
                {t("dash.createRequest")}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-3xl border border-slate-200/80 bg-white px-5 py-4 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 sm:items-center"
              >
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-extrabold text-slate-900">{req.material}</p>
                    <CollectionStatusBadge status={req.status} size="sm" />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5" />
                      {req.quantity}
                    </span>
                    <span className="inline-flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{req.address}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : t("common.recent")}
                    </span>
                  </div>
                </div>
                {req.status === "COMPLETED" ? (
                  <p className="text-sm font-extrabold text-emerald-700">+{req.pointsAwarded || 0} pts</p>
                ) : (
                  <p className="text-xs font-medium text-slate-500">
                    {req.status === "PENDING" ? t("dash.awaiting") : t("dash.inProgress")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
