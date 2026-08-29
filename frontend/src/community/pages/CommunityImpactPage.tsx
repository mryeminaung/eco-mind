import React, { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  MapPin,
  Sparkles,
  Award,
  CheckCircle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { CommunityEvent } from "@/types";
import { api } from "@/shared/api";

export const CommunityImpactPage: React.FC = () => {
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedEvents, setJoinedEvents] = useState<Record<string, boolean>>({});

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

  const handleJoin = async (id: string) => {
    try {
      const updated = await api.joinEvent(id);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
      setJoinedEvents((prev) => ({ ...prev, [id]: true }));
    } catch (err) {
      alert("Failed to register for event");
    }
  };

  const townshipRankings = [
    { rank: 1, township: "Bahan Township, Yangon", kg: 38400, participants: 840 },
    { rank: 2, township: "Kamayut Township, Yangon", kg: 32150, participants: 710 },
    { rank: 3, township: "Chanayethazan, Mandalay", kg: 26800, participants: 590 },
    { rank: 4, township: "Mayangone Township, Yangon", kg: 22400, participants: 480 },
    { rank: 5, township: "Mahaaungmyay, Mandalay", kg: 19500, participants: 395 },
  ];

  const segregationGuides = [
    {
      title: "Plastic Bottles (PET 1 & HDPE 2)",
      titleMy: "ပလတ်စတစ် ရေသန့်ဘူးနှင့် ဆပ်ပြာပုံး",
      prep: "Rinse leftover liquids, remove bottle caps, and flatten bottles to save 75% bag space.",
      accept: "Water bottles, oil jugs, shampoo containers",
      dontAccept: "Dirty plastic bags with food grease, PVC pipes",
    },
    {
      title: "Paper & Delivery Cardboards",
      titleMy: "ဂျိုကာဖာနှင့် စက္ကူအဟောင်း",
      prep: "Flatten carton boxes, remove excessive plastic packaging tapes, bundle with twine.",
      accept: "Online delivery boxes, newspapers, magazines, office paper",
      dontAccept: "Oily pizza boxes, wax-coated drink cartons",
    },
    {
      title: "Household E-Waste & Batteries",
      titleMy: "ဘက်ထရီနှင့် အီလက်ထရောနစ် စွန့်ပစ်",
      prep: "Tape battery terminals with clear tape to prevent short circuits. Keep dry.",
      accept: "Old smartphones, chargers, dead powerbanks, UPS batteries",
      dontAccept: "Cracked CRT glass tubes with mercury leak risk",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <Badge variant="eco" className="text-xs">
          Grassroots Environmental Action
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Community Drives & Education
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          Join local volunteer lake cleanups, master household zero-waste sorting, and explore township eco-rankings across Myanmar.
        </p>
      </div>

      {/* Events Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            Upcoming Community Clean-Up Drives
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-56 bg-slate-200/60 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((ev) => {
              const hasJoined = joinedEvents[ev.id];
              return (
                <Card
                  key={ev.id}
                  className="border border-slate-200/80 bg-white hover:border-emerald-400 flex flex-col justify-between"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-1">
                      <Badge variant="eco" className="text-[10px]">
                        {ev.city} • {ev.township}
                      </Badge>
                      <h3 className="font-bold text-slate-900 text-base">{ev.title}</h3>
                      <p className="text-xs text-slate-500 font-medium">By {ev.organizer}</p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{ev.description}</p>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{ev.date} ({ev.time})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{ev.participantsCount} Volunteers Registered</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Award: <strong>{ev.badgeAward}</strong></span>
                    </div>
                  </CardContent>

                  <div className="p-6 pt-0">
                    <Button
                      variant={hasJoined ? "outline" : "eco"}
                      size="sm"
                      onClick={() => handleJoin(ev.id)}
                      disabled={hasJoined}
                      className="w-full text-xs font-semibold gap-1.5 justify-center"
                    >
                      {hasJoined ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Registered as Volunteer!</span>
                        </>
                      ) : (
                        <span>Join Volunteer Drive</span>
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Segregation Guide & Township Leaderboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Col 1 & 2: Segregation Guide */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="text-xl font-bold text-slate-900">
              Household Waste Segregation Cheat-Sheet
            </h3>
          </div>

          <div className="space-y-3">
            {segregationGuides.map((guide, idx) => (
              <Card key={idx} className="border border-slate-200 bg-white">
                <CardContent className="p-5 space-y-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{guide.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{guide.titleMy}</p>
                  </div>

                  <p className="text-xs text-slate-700 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 font-medium">
                    💡 Preparation Tip: {guide.prep}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="text-emerald-800">
                      <span className="font-bold">✓ Accepted: </span>
                      <span>{guide.accept}</span>
                    </div>
                    <div className="text-rose-700">
                      <span className="font-bold">✗ Avoid: </span>
                      <span>{guide.dontAccept}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Col 3: Township Leaderboard */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="text-xl font-bold text-slate-900">
              Township Green Leaderboard
            </h3>
          </div>

          <Card className="border border-slate-200 bg-white">
            <CardContent className="p-4 space-y-3">
              {townshipRankings.map((item) => (
                <div
                  key={item.rank}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-xs border border-slate-100 hover:bg-emerald-50/50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        item.rank === 1
                          ? "bg-amber-400 text-amber-950"
                          : item.rank === 2
                          ? "bg-slate-300 text-slate-800"
                          : item.rank === 3
                          ? "bg-amber-700 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {item.rank}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{item.township}</p>
                      <p className="text-[10px] text-slate-500">{item.participants} active citizens</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-emerald-800">
                      {(item.kg / 1000).toFixed(1)} tons
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
