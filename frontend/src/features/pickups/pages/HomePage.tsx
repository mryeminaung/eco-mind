import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Truck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { ImpactOverview } from "@/shared/components/ImpactOverview";
import { WasteCategoryBadge, categoryMeta } from "@/shared/components/WasteCategoryBadge";
import { api } from "@/shared/api";
import { ImpactStats, RecyclerService, WasteCategory } from "@/types";
import { formatCurrency } from "@/shared/utils";
import { PageSectionHeader } from "@/shared/components/PageSectionHeader";
import { BarChart3 } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";
import { cityLabelKey } from "@/i18n/labels";

export const HomePage: React.FC = () => {
  const { t, locale } = useLocale();
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; type: string } | undefined>(undefined);
  const [featuredServices, setFeaturedServices] = useState<RecyclerService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsData, servicesData] = await Promise.all([
          api.getStats(),
          api.getServices(),
        ]);
        setStats(statsData.stats);
        setDbStatus(statsData.dbStatus);
        setFeaturedServices(servicesData.filter((s) => s.featured).slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const wasteCategories: WasteCategory[] = [
    "plastic",
    "paper",
    "metal",
    "electronic",
    "glass",
    "organic",
  ];

  return (
    <div className="space-y-12">
      <PageSectionHeader
        title={t("page.adminOverview.title")}
        description={t("page.adminOverview.description")}
        icon={BarChart3}
      />

      {/* Live Impact Counters */}
      {stats && <ImpactOverview stats={stats} dbStatus={dbStatus} loading={loading} />}

      {/* Recyclable Materials & Buyback Rate Guide */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {t("overview.materialsTitle")}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t("overview.materialsHint")}
            </p>
          </div>
          <Link to="/services">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <span>{t("overview.viewRates")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wasteCategories.map((cat) => {
            const meta = categoryMeta[cat];
            const Icon = meta.icon;
            return (
              <Card key={cat} className="border border-slate-200/80 hover:border-emerald-300">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2.5 rounded-xl border ${meta.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">
                          {locale === "my" && meta.labelMy ? meta.labelMy : meta.label}
                        </h4>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">{t("overview.buyback")}</span>
                    <span className="font-bold text-emerald-800">{meta.buyRate}</span>
                  </div>

                  <Link to={`/request-pickup?category=${cat}`}>
                    <Button variant="ghost" size="sm" className="w-full justify-between text-xs text-emerald-800 mt-1 h-8">
                      <span>{t("overview.schedulePickup", { material: locale === "my" && meta.labelMy ? meta.labelMy : meta.label })}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* AI Scanner Quick Banner */}
        <div className="p-6 rounded-3xl bg-linear-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t("overview.scannerEyebrow")}</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              {t("overview.scannerTitle")}
            </h3>
            <p className="text-xs text-emerald-100/90 max-w-xl">
              {t("overview.scannerText")}
            </p>
          </div>
          <Link to="/scan" className="shrink-0 w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-white text-emerald-950 hover:bg-emerald-50 font-bold gap-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>{t("overview.openScanner")}</span>
            </Button>
          </Link>
        </div>
      </section>


      {/* Featured Verified Recyclers */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {t("overview.partnersTitle")}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t("overview.partnersHint")}
            </p>
          </div>
          <Link to="/services">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <span>{t("overview.viewDirectory")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredServices.map((service) => (
            <Card key={service.id} className="border border-slate-200/80 hover:border-emerald-400 flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      {locale === "my" ? service.nameMyanmar || service.name : service.name}
                    </h3>
                  </div>
                  <Badge variant="success" className="text-[10px] shrink-0">
                    {t("services.verified")}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{t(cityLabelKey(service.city))} ({service.townshipsCovered.slice(0, 3).join(", ")}...)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{t("services.minPickup", { kg: service.minimumWeightKg })}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
                  {service.acceptedMaterials.map((mat) => (
                    <WasteCategoryBadge key={mat} category={mat} showIcon={false} />
                  ))}
                </div>
              </CardContent>

              <div className="p-6 pt-0">
                <Link to={`/request-pickup?collector=${service.id}`}>
                  <Button variant="secondary" className="w-full text-xs font-semibold">
                    {t("overview.requestWith", { name: service.name.split(" ")[0] })}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="rounded-2xl bg-emerald-50 border border-emerald-200/60 p-8 text-center space-y-4">
        <h3 className="text-2xl font-bold text-emerald-950">
          {t("overview.ctaTitle")}
        </h3>
        <p className="text-sm text-emerald-800 max-w-xl mx-auto">
          {t("overview.ctaText")}
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link to="/admin/users">
            <Button variant="eco" size="lg" className="shadow-md">
              {t("overview.manageUsers")}
            </Button>
          </Link>
          <Link to="/centers">
            <Button variant="outline" size="lg" className="bg-white">
              {t("overview.centers")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
