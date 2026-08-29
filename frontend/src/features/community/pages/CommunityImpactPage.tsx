import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Award,
  BookOpen,
  Calendar,
  Cpu,
  CheckCircle2,
  LogIn,
  MapPin,
  Package,
  Recycle,
  Trophy,
  Users,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { CommunityEvent } from "@/types";
import { api } from "@/shared/api";
import { useAuth } from "@/features/auth/AuthContext";
import { MarketingLayout } from "@/features/landing/MarketingLayout";
import { useLocale } from "@/i18n/LocaleContext";
import { cityLabelKey } from "@/i18n/labels";
import { cn } from "@/shared/utils";

const townshipRankings = [
  { rank: 1, township: "Bahan Township, Yangon", kg: 38400, participants: 840 },
  { rank: 2, township: "Kamayut Township, Yangon", kg: 32150, participants: 710 },
  { rank: 3, township: "Chanayethazan, Mandalay", kg: 26800, participants: 590 },
  { rank: 4, township: "Mayangone Township, Yangon", kg: 22400, participants: 480 },
  { rank: 5, township: "Mahaaungmyay, Mandalay", kg: 19500, participants: 395 },
];

const segregationGuides = [
  {
    icon: Recycle,
    title: "Plastic bottles",
    titleMy: "ပလတ်စတစ် ရေသန့်ဘူးနှင့် ဆပ်ပြာပုံး",
    prep: "Rinse leftover liquids, remove bottle caps, and flatten bottles to save bag space.",
    accept: "Water bottles, oil jugs, shampoo containers",
    dontAccept: "Greasy plastic bags, PVC pipes",
  },
  {
    icon: Package,
    title: "Paper & cardboard",
    titleMy: "ဂျိုကာဖာနှင့် စက္ကူအဟောင်း",
    prep: "Flatten carton boxes, remove excess tape, and bundle with twine.",
    accept: "Delivery boxes, newspapers, magazines, office paper",
    dontAccept: "Oily pizza boxes, wax-coated drink cartons",
  },
  {
    icon: Cpu,
    title: "E-waste & batteries",
    titleMy: "ဘက်ထရီနှင့် အီလက်ထရောနစ် စွန့်ပစ်",
    prep: "Tape battery terminals and keep items dry to avoid short circuits.",
    accept: "Phones, chargers, power banks, UPS batteries",
    dontAccept: "Cracked CRT glass with mercury leak risk",
  },
];

function formatEventDate(date: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return { weekday: "", day: date, month: "" };
  return {
    weekday: parsed.toLocaleDateString("en-GB", { weekday: "short" }),
    day: parsed.toLocaleDateString("en-GB", { day: "numeric" }),
    month: parsed.toLocaleDateString("en-GB", { month: "short" }),
  };
}

export const CommunityImpactPage: React.FC = () => {
  const { user } = useAuth();
  const { t, locale } = useLocale();
  const navigate = useNavigate();
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState("ALL");
  const [joinedEvents, setJoinedEvents] = useState<Record<string, boolean>>({});
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getEvents();
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cities = useMemo(
    () => Array.from(new Set(events.map((event) => event.city))),
    [events],
  );

  const filteredEvents = events.filter((event) =>
    cityFilter === "ALL" ? true : event.city === cityFilter,
  );

  const volunteerCount = events.reduce((sum, event) => sum + event.participantsCount, 0);
  const maxTownshipKg = townshipRankings[0]?.kg || 1;

  const handleJoin = async (id: string) => {
    if (!user) {
      navigate("/login", { state: { from: "/community" } });
      return;
    }
    setJoinError(null);
    setJoiningId(id);
    try {
      const updated = await api.joinEvent(id);
      setEvents((prev) => prev.map((event) => (event.id === id ? updated : event)));
      setJoinedEvents((prev) => ({ ...prev, [id]: true }));
    } catch {
      setJoinError(t("community.joinFailed"));
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <MarketingLayout>
      <div className="space-y-12 sm:space-y-16 pb-8">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white p-8 sm:p-12">
          <div className="relative z-10 max-w-3xl space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-lima-300">
              {t("community.eyebrow")}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              {t("community.title")}
            </h1>
            <p className="text-base sm:text-lg text-emerald-100/85 leading-relaxed max-w-2xl">
              {t("community.lead")}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { id: "ALL", label: t("community.allCities"), prefix: String(events.length) },
                ...cities.map((city) => ({
                  id: city,
                  label: t(cityLabelKey(city)),
                  prefix: String(events.filter((event) => event.city === city).length),
                })),
              ].map((pill) => (
                <button
                  key={pill.id}
                  type="button"
                  onClick={() => setCityFilter(pill.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                    cityFilter === pill.id
                      ? "bg-lima-400 text-emerald-950 border-lima-400"
                      : "bg-white/10 border-white/10 text-emerald-50 hover:bg-white/15",
                  )}
                >
                  <span className={cityFilter === pill.id ? "text-emerald-900" : "text-lima-400"}>
                    {pill.prefix}
                  </span>
                  {pill.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-6 pt-2 text-sm text-emerald-100/80 border-t border-white/10">
              <div>
                <p className="text-2xl font-extrabold text-white">{loading ? "—" : events.length}</p>
                <p className="text-xs text-emerald-200/75">{t("community.upcomingCount")}</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{loading ? "—" : volunteerCount}</p>
                <p className="text-xs text-emerald-200/75">{t("community.volunteersSigned")}</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">{townshipRankings.length}</p>
                <p className="text-xs text-emerald-200/75">{t("community.townshipsRanked")}</p>
              </div>
            </div>
          </div>
          <Users className="absolute -right-8 -bottom-10 w-64 h-64 text-emerald-200/12 pointer-events-none hidden sm:block" />
        </section>

        <section className="space-y-6" id="drives">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{t("community.drivesEyebrow")}</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {t("community.upcoming")}
              </h2>
            </div>
            {!user && (
              <p className="text-sm text-slate-500">{t("community.signInHint")}</p>
            )}
          </div>

          {joinError && (
            <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3">
              {joinError}
            </p>
          )}

          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-36 bg-white border border-slate-200/80 rounded-3xl" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="rounded-3xl border border-slate-200/80 bg-white px-6 py-14 text-center">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-800">{t("community.empty")}</p>
              <p className="text-sm text-slate-500 mt-1">{t("community.emptyHint")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map((event) => {
                const hasJoined = joinedEvents[event.id];
                const date = formatEventDate(event.date);

                return (
                  <article
                    key={event.id}
                    className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-[5.5rem_minmax(0,1fr)_13.5rem] gap-5 sm:gap-6 sm:items-center"
                  >
                    <div className="w-[5.5rem] h-[5.5rem] rounded-2xl bg-lima-50 border border-lima-100 flex flex-col items-center justify-center text-center">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                        {date.weekday}
                      </span>
                      <span className="text-3xl font-black text-emerald-950 leading-none mt-1">
                        {date.day}
                      </span>
                      <span className="text-xs font-semibold text-emerald-800 mt-1">{date.month}</span>
                    </div>

                    <div className="min-w-0 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold">
                          {event.city} · {event.township}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-0.5 text-[11px] font-semibold">
                          {event.targetWasteType}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-900 leading-snug line-clamp-1">
                          {event.title}
                        </h3>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{t("community.by", { name: event.organizer })}</p>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          {event.time}
                        </span>
                        <span className="inline-flex items-center gap-1.5 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          {t("community.volunteersCount", { count: event.participantsCount })}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 sm:w-[13.5rem]">
                      <div className="flex items-start gap-2 rounded-2xl bg-amber-50 border border-amber-100 px-3 py-2.5 text-xs text-amber-900 min-h-[3.25rem]">
                        <Award className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          {t("community.badge")}: <strong>{event.badgeAward}</strong>
                        </span>
                      </div>
                      <Button
                        variant={hasJoined ? "outline" : "eco"}
                        onClick={() => handleJoin(event.id)}
                        disabled={hasJoined || joiningId === event.id}
                        className="w-full gap-1.5 font-semibold"
                      >
                        {hasJoined ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            {t("community.registered")}
                          </>
                        ) : joiningId === event.id ? (
                          t("community.joining")
                        ) : user ? (
                          t("community.join")
                        ) : (
                          <>
                            <LogIn className="w-4 h-4" />
                            {t("community.signIn")}
                          </>
                        )}
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{t("community.guideEyebrow")}</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-700" />
              {t("community.guideTitle")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {segregationGuides.map((guide) => (
              <article
                key={guide.title}
                className="rounded-3xl border border-slate-200/80 bg-white p-6 space-y-4"
              >
                <div className="w-11 h-11 rounded-2xl bg-lima-100 text-lima-800 flex items-center justify-center">
                  <guide.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {locale === "my" ? guide.titleMy : guide.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{guide.prep}</p>
                <div className="space-y-2 text-sm">
                  <p className="rounded-2xl bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-emerald-900">
                    <span className="font-bold">{t("community.accepted")} </span>
                    {guide.accept}
                  </p>
                  <p className="rounded-2xl bg-rose-50 border border-rose-100 px-3 py-2.5 text-rose-800">
                    <span className="font-bold">{t("community.avoid")} </span>
                    {guide.dontAccept}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">{t("community.rankEyebrow")}</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              {t("community.rankTitle")}
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 space-y-3">
            {townshipRankings.map((item) => (
              <div
                key={item.rank}
                className={cn(
                  "rounded-2xl border px-4 py-3.5",
                  item.rank === 1
                    ? "border-lima-200 bg-lima-50"
                    : "border-slate-100 bg-slate-50/70",
                )}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0",
                      item.rank === 1
                        ? "bg-amber-400 text-amber-950"
                        : item.rank === 2
                          ? "bg-slate-300 text-slate-800"
                          : item.rank === 3
                            ? "bg-amber-700 text-white"
                            : "bg-white text-slate-600 border border-slate-200",
                    )}
                  >
                    {item.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate">{item.township}</p>
                        <p className="text-xs text-slate-500">{t("community.citizens", { count: item.participants })}</p>
                      </div>
                      <p className="text-sm font-extrabold text-emerald-800 whitespace-nowrap">
                        {(item.kg / 1000).toFixed(1)} tons
                      </p>
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-white border border-slate-200/80 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-600"
                        style={{ width: `${Math.max(12, (item.kg / maxTownshipKg) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-lima-100 border border-lima-200/80 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-lima-950">{t("community.ctaTitle")}</h2>
            <p className="text-sm font-medium text-lima-800 max-w-xl">
              {t("community.ctaText")}
            </p>
          </div>
          {user ? (
            <Link to={user.role === "RECYCLER" ? "/collector" : "/request-pickup"}>
              <Button size="lg" variant="eco">
                {user.role === "RECYCLER" ? t("community.openQueue") : t("community.requestPickup")}
              </Button>
            </Link>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Link to="/register" state={{ from: "/community" }}>
                <Button size="lg" variant="eco">
                  {t("auth.register")}
                </Button>
              </Link>
              <Link to="/login" state={{ from: "/community" }}>
                <Button size="lg" variant="outline" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  {t("auth.login")}
                </Button>
              </Link>
            </div>
          )}
        </section>
      </div>
    </MarketingLayout>
  );
};
