import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, Coins, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { PageSectionHeader } from "@/shared/components/PageSectionHeader";
import { UserRewardProfile } from "@/types";
import { api } from "@/shared/api";
import { useAuth } from "@/features/auth/AuthContext";
import { useLocale } from "@/i18n/LocaleContext";
import { BADGE_TIERS, badgeAwardFromPoints, badgeIndexFromPoints } from "@/shared/badgeAward";

export const GreenRewardsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { t } = useLocale();
  const userId = searchParams.get("userId") || user?.id || "";

  const [rewardProfile, setRewardProfile] = useState<UserRewardProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadRewards = async () => {
    try {
      setRefreshing(true);
      const profileData = await api.getUserRewardProfile(userId);
      setRewardProfile(profileData);
    } catch (err) {
      console.error("Error loading green rewards:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRewards();
  }, [userId]);

  const points = rewardProfile?.totalPoints ?? 0;
  const activeIndex = badgeIndexFromPoints(points);
  const badges = BADGE_TIERS.map((tier) => ({
    title: t(tier.key),
    minPoints: tier.minPoints,
    earned: points >= tier.minPoints,
  }));
  const recentTransactions = (rewardProfile?.transactions || []).slice(0, 5);

  return (
    <div className="space-y-6 pb-12">
      <PageSectionHeader
        title={t("page.rewards.title")}
        description={t("page.rewards.description")}
        icon={Coins}
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={loadRewards}
            disabled={refreshing}
            className="gap-1.5 bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {t("common.refresh")}
          </Button>
        }
      />

      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8">
        {loading ? (
          <div className="h-28 bg-slate-100 rounded-2xl animate-pulse" />
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{t("rewards.total")}</p>
              <p className="text-5xl font-black text-emerald-800 tracking-tight mt-1">{points}</p>
              <p className="text-sm text-slate-600 mt-2">
                {badgeAwardFromPoints(points)}
                {rewardProfile
                  ? ` · ${t("rewards.meta", { items: rewardProfile.itemsRecycledCount, kg: rewardProfile.totalWeightKg })}`
                  : ""}
              </p>
            </div>
            {rewardProfile?.environmentalImpact?.summaryStatement && (
              <p className="text-sm text-slate-600 max-w-md sm:text-right leading-relaxed">
                {rewardProfile.environmentalImpact.summaryStatement}
              </p>
            )}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">{t("rewards.badges")}</h2>
        <div className="rounded-3xl border border-slate-200/80 bg-white px-3 py-5 sm:px-5 sm:py-6 overflow-x-auto">
          <ol className="grid grid-cols-4 min-w-[36rem]">
            {badges.map((badge, index) => {
              const isActive = index === activeIndex;
              const prevEarned = index === 0 || badges[index - 1].earned;
              const nextEarned = index < badges.length - 1 && badge.earned;
              const statusLabel = badge.earned
                ? t("rewards.unlocked")
                : isActive
                  ? t("rewards.current")
                  : t("rewards.inProgress");

              return (
                <li key={badge.title}>
                  <div>
                    <div className="flex items-center">
                      <span
                        className={`h-0.5 flex-1 ${
                          index === 0 ? "bg-transparent" : prevEarned ? "bg-emerald-500" : "bg-slate-200"
                        }`}
                      />
                      <span
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                          isActive
                            ? "bg-lima-400 text-emerald-950 ring-4 ring-lima-400/25 scale-110"
                            : badge.earned
                              ? "bg-emerald-700 text-white"
                              : "bg-white text-slate-400 border-2 border-slate-200"
                        }`}
                      >
                        {badge.earned ? <Check className="w-4 h-4" strokeWidth={2.5} /> : index + 1}
                      </span>
                      <span
                        className={`h-0.5 flex-1 ${
                          index === badges.length - 1
                            ? "bg-transparent"
                            : nextEarned
                              ? "bg-emerald-500"
                              : "bg-slate-200"
                        }`}
                      />
                    </div>
                    <div
                      className={`mt-3 mx-1.5 rounded-2xl border px-3 py-3 transition-all ${
                        isActive
                          ? "border-lima-400 bg-lima-50 ring-2 ring-lima-400/20 shadow-sm"
                          : badge.earned
                            ? "border-emerald-200 bg-white"
                            : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <p className={`font-bold text-sm leading-snug ${isActive || badge.earned ? "text-slate-900" : "text-slate-400"}`}>
                        {badge.title}
                      </p>
                      <p
                        className={`text-xs mt-1 font-semibold ${
                          isActive ? "text-emerald-800" : badge.earned ? "text-emerald-700" : "text-slate-400"
                        }`}
                      >
                        {statusLabel}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t("rewards.badge.pts", { points: badge.minPoints })}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">{t("rewards.recent")}</h2>
        <div className="rounded-3xl border border-slate-200/80 bg-white overflow-hidden">
          {loading ? (
            <div className="h-32 animate-pulse bg-slate-50" />
          ) : recentTransactions.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Sparkles className="w-6 h-6 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">{t("rewards.empty.title")}</p>
              <p className="text-xs text-slate-500 mt-1">{t("rewards.empty.text")}</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentTransactions.map((tx) => (
                <li key={tx.id} className="px-5 py-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{tx.material}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(tx.timestamp).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <p className="text-sm font-extrabold text-emerald-700 shrink-0">+{tx.pointsEarned}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
};
