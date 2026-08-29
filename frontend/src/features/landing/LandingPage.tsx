import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LogIn,
  UserPlus,
  ScanLine,
  Truck,
  Coins,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  Building2,
  Recycle,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ImpactOverview } from "@/shared/components/ImpactOverview";
import { roleHomePath, useAuth } from "@/features/auth/AuthContext";
import { useLocale } from "@/i18n/LocaleContext";
import { MarketingLayout } from "./MarketingLayout";
import { api } from "@/shared/api";
import { ImpactStats } from "@/types";

const STEPS = [
  { step: "01", icon: ScanLine, titleKey: "landing.how.step1.title", textKey: "landing.how.step1.text" },
  { step: "02", icon: Truck, titleKey: "landing.how.step2.title", textKey: "landing.how.step2.text" },
  { step: "03", icon: Coins, titleKey: "landing.how.step3.title", textKey: "landing.how.step3.text" },
];

const ROLES = [
  {
    labelKey: "landing.roles.citizen",
    role: "USER",
    icon: Users,
    accent: "text-emerald-700 bg-emerald-50 border-emerald-200",
    featureKeys: [
      "landing.roles.citizen.1",
      "landing.roles.citizen.2",
      "landing.roles.citizen.3",
      "landing.roles.citizen.4",
    ],
    cta: { to: "/register", labelKey: "landing.roles.joinCitizen" },
  },
  {
    labelKey: "landing.roles.collector",
    role: "RECYCLER",
    icon: Truck,
    accent: "text-sky-700 bg-sky-50 border-sky-200",
    featureKeys: [
      "landing.roles.recycler.1",
      "landing.roles.recycler.2",
      "landing.roles.recycler.3",
      "landing.roles.recycler.4",
    ],
    cta: { to: "/register", labelKey: "landing.roles.joinRecycler" },
  },
  {
    labelKey: "landing.roles.platform",
    role: "ADMIN",
    icon: Building2,
    accent: "text-amber-700 bg-amber-50 border-amber-200",
    featureKeys: [
      "landing.roles.admin.1",
      "landing.roles.admin.2",
      "landing.roles.admin.3",
      "landing.roles.admin.4",
    ],
  },
];

export const LandingPage: React.FC = () => {
  const { user, signingOut, finishSignOut } = useAuth();
  const { t } = useLocale();
  const location = useLocation();
  const appPath = roleHomePath(user?.role);
  const nextPath = (location.state as { from?: string } | null)?.from;
  const authState = nextPath ? { from: nextPath } : undefined;

  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; type: string } | undefined>(undefined);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (signingOut) finishSignOut();
  }, [signingOut, finishSignOut]);

  useEffect(() => {
    let cancelled = false;
    api
      .getStats()
      .then((result) => {
        if (cancelled) return;
        setStats(result.stats);
        setDbStatus(result.dbStatus);
      })
      .catch(() => {
        /* api.getStats already falls back locally */
      })
      .finally(() => {
        if (!cancelled) setStatsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <MarketingLayout>
        <section className="pb-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white p-8 sm:p-12 shadow-xl">
            <div className="relative z-10 max-w-3xl space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                {t("landing.hero.title")}
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl font-normal">
                {t("landing.hero.description")}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to={user ? "/scan" : "/login"}
                  state={user ? undefined : { from: "/scan" }}
                >
                  <Button size="lg" className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold gap-2 shadow-lg shadow-emerald-950/40">
                    <Sparkles className="w-5 h-5 text-emerald-950" />
                    <span>{t("landing.hero.scan")}</span>
                  </Button>
                </Link>
                <Link
                  to={user ? "/centers" : "/login"}
                  state={user ? undefined : { from: "/centers" }}
                >
                  <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-xs gap-2">
                    <Building2 className="w-5 h-5" />
                    <span>{t("landing.hero.centers")}</span>
                  </Button>
                </Link>
                <Link
                  to={user ? "/request-pickup" : "/login"}
                  state={user ? undefined : { from: "/request-pickup" }}
                >
                  <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-xs gap-2">
                    <PlusCircle className="w-5 h-5" />
                    <span>{t("landing.hero.pickup")}</span>
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-emerald-200/80 border-t border-emerald-800/60">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{t("landing.hero.collectors")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-300" />
                  <span>{t("landing.hero.buyback")}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-teal-300" />
                  <span>{t("landing.hero.scheduling")}</span>
                </div>
              </div>
            </div>

            <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block opacity-20 pointer-events-none">
              <Recycle className="w-80 h-80 text-emerald-200" />
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{t("landing.how.eyebrow")}</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t("landing.how.title")}
              </h2>
            </div>
            {!user && (
              <Link to="/register" state={authState}>
                <Button variant="secondary" className="gap-1.5">
                  {t("landing.how.createAccount")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-lima-100 text-lima-800 flex items-center justify-center">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold tracking-widest text-slate-400">{item.step}</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{t(item.titleKey)}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{t(item.textKey)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            {user ? (
              <Link to={user.role === "RECYCLER" ? "/collector" : "/request-pickup"}>
                <Button variant="outline" className="gap-2">
                  <Truck className="w-4 h-4" />
                  {user.role === "RECYCLER" ? t("landing.how.openQueue") : t("landing.how.requestPickup")}
                </Button>
              </Link>
            ) : (
              <Link to="/register" state={authState}>
                <Button variant="outline" className="gap-2">
                  <Truck className="w-4 h-4" />
                  {t("landing.how.requestPickup")}
                </Button>
              </Link>
            )}
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <ImpactOverview
            stats={stats ?? {
              totalKgRecycled: 0,
              co2SavedKg: 0,
              treesEquivalent: 0,
              totalMmkPaidToCitizens: 0,
              activePickups: 0,
              verifiedCollectors: 0,
              registeredCitizens: 0,
            }}
            dbStatus={dbStatus}
            loading={statsLoading}
          />
        </section>

        <section className="py-8 sm:py-12">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{t("landing.community.eyebrow")}</p>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {t("landing.community.title")}
              </h2>
              <p className="text-sm text-slate-600 max-w-xl">
                {t("landing.community.text")}
              </p>
            </div>
            <Link to="/community">
              <Button size="lg" variant="eco" className="gap-2">
                <Users className="w-4 h-4" />
                {t("landing.community.cta")}
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <div className="space-y-2 mb-8">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{t("landing.roles.eyebrow")}</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t("landing.roles.title")}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {ROLES.map((card) => (
              <div
                key={card.role}
                className="rounded-3xl border border-slate-200/80 bg-white p-6 flex flex-col gap-5"
              >
                <div className="space-y-3">
                  <div className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${card.accent}`}>
                    <card.icon className="w-3.5 h-3.5" />
                    {t(card.labelKey)}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900">{card.role}</h3>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {card.featureKeys.map((featureKey) => (
                    <li key={featureKey} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{t(featureKey)}</span>
                    </li>
                  ))}
                </ul>
                {card.cta && !user && (
                  <Link to={card.cta.to} state={authState}>
                    <Button variant="secondary" className="w-full gap-1.5">
                      {t(card.cta.labelKey)}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="pb-8">
          <div className="rounded-3xl bg-lima-100 border border-lima-200/80 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-lima-950">{t("landing.cta.title")}</h2>
              <p className="text-sm font-medium text-lima-800 max-w-xl">
                {t("landing.cta.text")}
              </p>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-lima-800">
                <ShieldCheck className="w-4 h-4" />
                {t("landing.cta.verified")}
              </p>
            </div>
            {user ? (
              <Link to={appPath}>
                <Button size="lg" variant="eco">
                  {t("auth.openApp")}
                </Button>
              </Link>
            ) : (
              <div className="flex flex-wrap gap-3">
                <Link to="/register" state={authState}>
                  <Button size="lg" variant="eco" className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    {t("auth.register")}
                  </Button>
                </Link>
                <Link to="/login" state={authState}>
                  <Button size="lg" variant="outline" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    {t("auth.login")}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>
    </MarketingLayout>
  );
};
