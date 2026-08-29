import React, { useEffect, useState } from "react";
import {
  Search,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  BadgeCheck,
  ArrowUpDown,
  Filter,
  Leaf,
  Banknote,
} from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Badge } from "@/shared/ui/badge";
import { WasteCategoryBadge } from "@/shared/components/WasteCategoryBadge";
import { PageSectionHeader } from "@/shared/components/PageSectionHeader";
import { useLocale } from "@/i18n/LocaleContext";
import { cityLabelKey } from "@/i18n/labels";
import { RecyclerService } from "@/types";
import { api } from "@/shared/api";

export const ServicesDirectoryPage: React.FC = () => {
  const { t, locale } = useLocale();
  const [services, setServices] = useState<RecyclerService[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      try {
        const data = await api.getServices(
          selectedCity !== "All" ? selectedCity : undefined,
          selectedMaterial !== "all" ? selectedMaterial : undefined
        );
        setServices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, [selectedCity, selectedMaterial]);

  const filtered = services.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      (s.nameMyanmar && s.nameMyanmar.toLowerCase().includes(q)) ||
      s.address.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
    );
  });

  const typeIcon = (type: RecyclerService["type"]) => {
    switch (type) {
      case "collector":
        return "🚛";
      case "drop_off_center":
        return "🏢";
      case "social_enterprise":
        return "🌱";
      case "scrap_dealer":
        return "♻️";
      default:
        return "📦";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageSectionHeader
        title={t("page.services.title")}
        description={t("page.services.description")}
        icon={Leaf}
      />

      {/* Filter toolbar */}
      <Card className="border border-slate-200/80 bg-white">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                placeholder={t("services.search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div>
              <Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="All">{t("city.all")}</option>
                <option value="Yangon">{t("city.yangon")}</option>
                <option value="Mandalay">{t("city.mandalay")}</option>
                <option value="Naypyidaw">{t("city.naypyidaw")}</option>
                <option value="Bago">{t("city.bago")}</option>
                <option value="Mawlamyine">{t("city.mawlamyine")}</option>
                <option value="Taunggyi">{t("city.taunggyi")}</option>
              </Select>
            </div>
            <div>
              <Select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
              >
                <option value="all">{t("material.all")}</option>
                <option value="plastic">{t("material.plastic")}</option>
                <option value="paper">{t("material.paper")}</option>
                <option value="metal">{t("material.metal")}</option>
                <option value="glass">{t("material.glass")}</option>
                <option value="electronic">{t("material.electronic")}</option>
                <option value="organic">{t("material.organic")}</option>
                <option value="textile">{t("material.textile")}</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-200/60 rounded-2xl"></div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <p className="text-base font-semibold text-slate-700">{t("services.empty")}</p>
          <p className="text-xs text-slate-500">{t("services.emptyHint")}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedCity("All");
              setSelectedMaterial("all");
            }}
          >
            {t("common.reset")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((service) => (
            <Card
              key={service.id}
              className="border border-slate-200/80 bg-white hover:border-emerald-400 flex flex-col"
            >
              <CardContent className="p-5 space-y-3 flex-1">
                {/* Top row: badges */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{typeIcon(service.type)}</span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">
                        {locale === "my" ? service.nameMyanmar || service.name : service.name}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {service.verified && (
                      <Badge variant="success" className="text-[10px] gap-1">
                        <BadgeCheck className="w-3 h-3" />
                        {t("services.verified")}
                      </Badge>
                    )}
                    {service.featured && (
                      <Badge variant="eco" className="text-[10px]">{t("services.featured")}</Badge>
                    )}
                  </div>
                </div>

                {/* Type & Rating */}
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                    {t(`services.type.${service.type}`)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {service.rating.toFixed(1)}
                    <span className="text-slate-400">({service.reviewsCount})</span>
                  </span>
                </div>

                {/* Contact & Location */}
                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">
                        {t(cityLabelKey(service.city))}
                        {service.townshipsCovered.length > 0 && (
                          <> &middot; {service.townshipsCovered.join(", ")}</>
                        )}
                      </p>
                      <p className="text-slate-500">{service.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <a href={`tel:${service.phone}`} className="hover:text-emerald-700 underline underline-offset-2">
                      {service.phone}
                    </a>
                  </div>
                  {service.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{service.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{service.operatingHours}</span>
                  </div>
                </div>

                {/* Accepted Materials */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    {t("services.accepts")}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {service.acceptedMaterials.map((mat) => (
                      <WasteCategoryBadge key={mat} category={mat} />
                    ))}
                  </div>
                </div>

                {/* Scrap rates callout */}
                {service.paysForScrap && service.ratePerKg && Object.keys(service.ratePerKg).length > 0 && (
                  <div className="flex items-start gap-2 bg-emerald-50 text-emerald-900 border border-emerald-200/80 p-2.5 rounded-xl text-xs">
                    <Banknote className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold">{t("services.pays")}</strong>{" "}
                      {Object.entries(service.ratePerKg)
                        .filter(([, v]) => v !== undefined)
                        .map(([k, v]) => `${k}: ${v} MMK/kg`)
                        .join(" | ")}
                    </div>
                  </div>
                )}

                {/* Min weight */}
                <div className="text-[11px] text-slate-500">
                  {t("services.minPickup", { kg: service.minimumWeightKg })}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2">{service.description}</p>
              </CardContent>

              <div className="p-5 pt-0">
                <a href={`tel:${service.phone}`} className="block">
                  <Button variant="default" size="sm" className="w-full text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                    <Phone className="w-3.5 h-3.5" />
                    {t("services.contact")}
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
