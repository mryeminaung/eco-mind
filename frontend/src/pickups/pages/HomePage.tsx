import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Recycle,
  PlusCircle,
  MapPin,
  Truck,
  ShieldCheck,
  Coins,
  Scale,
  Sparkles,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Building2,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { ImpactOverview } from "@/shared/components/ImpactOverview";
import { WasteCategoryBadge, categoryMeta } from "@/shared/components/WasteCategoryBadge";
import { api } from "@/shared/api";
import { ImpactStats, RecyclerService, WasteCategory } from "@/types";
import { formatCurrency } from "@/shared/utils";

export const HomePage: React.FC = () => {
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
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white p-8 sm:p-12 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Myanmar's First Community Recycling Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Transform Your Waste Into Value & Community Impact.
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl font-normal">
            Connect directly with verified local collectors in Yangon, Mandalay & nationwide. Schedule free doorstep pickups, get paid fair scrap rates, and build a cleaner Myanmar.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to="/scan">
              <Button size="lg" className="bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold gap-2 shadow-lg shadow-emerald-950/40">
                <Sparkles className="w-5 h-5 text-emerald-950" />
                <span>AI Waste Scanner</span>
              </Button>
            </Link>
            <Link to="/centers">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-xs gap-2">
                <Building2 className="w-5 h-5" />
                <span>Center Finder</span>
              </Button>
            </Link>
            <Link to="/request-pickup">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-xs gap-2">
                <PlusCircle className="w-5 h-5" />
                <span>Schedule Pickup</span>
              </Button>
            </Link>
          </div>


          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-emerald-200/80 border-t border-emerald-800/60">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Myanmar Collectors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-300" />
              <span>Direct Kyat (MMK) Scrap Buyback</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-teal-300" />
              <span>Reliable Neighborhood Scheduling</span>
            </div>
          </div>
        </div>

        {/* Decorative background eco ring */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden lg:block opacity-20 pointer-events-none">
          <Recycle className="w-80 h-80 text-emerald-200" />
        </div>
      </section>

      {/* Live Impact Counters */}
      {stats && <ImpactOverview stats={stats} dbStatus={dbStatus} loading={loading} />}

      {/* How it Works Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="eco" className="text-xs">
            Simple 3-Step Process
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How RecycleConnect Myanmar Works
          </h2>
          <p className="text-sm text-slate-600">
            Bringing convenience, transparency, and cash rewards to everyday household & business recycling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-slate-200/80 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-lg">
                Sort & Request Online
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Separate your plastics, paper, metals, or electronics. Pick your Myanmar township, date, and preferred time slot.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/80 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-lg">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-lg">
                Verified Doorstep Collector
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                A verified neighborhood collector or enterprise arrives at your doorstep with digital scales to weigh and collect.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/80 bg-white">
            <CardContent className="p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-lg">
                Get Paid & Earn Eco-Points
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive fair market Kyat (MMK) buyback immediately, earn community eco-points, and track your CO2 reduction impact.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recyclable Materials & Buyback Rate Guide */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant="eco" className="text-xs mb-1">
              Current Scrap Market Rates
            </Badge>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Accepted Materials & Estimated Values
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Rates updated weekly based on Yangon & Mandalay recycling depot markets.
            </p>
          </div>
          <Link to="/services">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <span>View All Rates & Recyclers</span>
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
                        <h4 className="font-bold text-slate-900 text-base">{meta.label}</h4>
                        <p className="text-xs text-slate-500 font-medium">{meta.labelMy}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Estimated Scrap Buyback:</span>
                    <span className="font-bold text-emerald-800">{meta.buyRate}</span>
                  </div>

                  <Link to={`/request-pickup?category=${cat}`}>
                    <Button variant="ghost" size="sm" className="w-full justify-between text-xs text-emerald-800 mt-1 h-8">
                      <span>Schedule {meta.label} Pickup</span>
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
              <span>Smart Vision Detection</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Not sure if your waste item is recyclable?
            </h3>
            <p className="text-xs text-emerald-100/90 max-w-xl">
              Snap a photo with our AI Scanner. We'll identify whether it's PET plastic, aluminum, circuit e-waste, or paper, and show you exactly how to clean and prepare it for pickup.
            </p>
          </div>
          <Link to="/scan" className="shrink-0 w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-white text-emerald-950 hover:bg-emerald-50 font-bold gap-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Open AI Scanner</span>
            </Button>
          </Link>
        </div>
      </section>


      {/* Featured Verified Recyclers */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Badge variant="eco" className="text-xs mb-1">
              Trusted Network
            </Badge>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Featured Verified Recycling Partners
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Social enterprises, certified waste management providers, and community aggregators.
            </p>
          </div>
          <Link to="/services">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <span>View Full Directory</span>
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
                    <h3 className="font-bold text-slate-900 text-lg">{service.name}</h3>
                    {service.nameMyanmar && (
                      <p className="text-xs text-slate-500 mt-0.5">{service.nameMyanmar}</p>
                    )}
                  </div>
                  <Badge variant="success" className="text-[10px] shrink-0">
                    Verified
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{service.city} ({service.townshipsCovered.slice(0, 3).join(", ")}...)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Min weight: {service.minimumWeightKg} kg</span>
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
                    Request Pickup With {service.name.split(" ")[0]}
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
          Ready to Start Recycling in Your Township?
        </h3>
        <p className="text-sm text-emerald-800 max-w-xl mx-auto">
          Join thousands of citizens across Yangon and Mandalay creating cleaner streets, reducing pollution, and earning rewards.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link to="/request-pickup">
            <Button variant="eco" size="lg" className="shadow-md">
              Book a Pickup Now
            </Button>
          </Link>
          <Link to="/hubs">
            <Button variant="outline" size="lg" className="bg-white">
              Find Drop-off Hub
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
