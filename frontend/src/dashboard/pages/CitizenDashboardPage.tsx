import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  User,
  Phone,
  Scale,
  Leaf,
  Coins,
  Award,
  PlusCircle,
  Truck,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Clock,
  MapPin,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui/tabs";
import { CollectionStatusBadge } from "@/shared/components/CollectionStatusBadge";
import { GreenPointsSummary } from "../components/GreenPointsSummary";
import { EnvironmentalImpactCard } from "@/shared/components/EnvironmentalImpactCard";
import { PointsCalculatorWidget } from "../components/PointsCalculatorWidget";
import { PointsHistoryLedger } from "../components/PointsHistoryLedger";
import { CollectionRequest, UserRewardProfile } from "@/types";
import { api } from "@/shared/api";
import { formatWeight } from "@/shared/utils";
import { useAuth } from "@/auth/AuthContext";

export const CitizenDashboardPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const userId = searchParams.get("userId") || user?.id || "";

  const [rewardProfile, setRewardProfile] = useState<UserRewardProfile | null>(null);
  const [collectionRequests, setCollectionRequests] = useState<CollectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("impact");

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

  const citizenBadges = [
    {
      title: "Green Pioneer",
      titleMy: "ရှေ့ဆောင် သဘာဝထိန်းသိမ်းသူ",
      earned: (rewardProfile?.totalPoints || 0) > 0,
      desc: "Earned your first certified Green Points by recycling in Myanmar",
      icon: "🌱",
    },
    {
      title: "Plastic Diverter (15kg+)",
      titleMy: "ပလတ်စတစ် ၁၅ ကီလိုကျော် လျှော့ချသူ",
      earned: (rewardProfile?.materialBreakdown?.plasticKg || 0) >= 15,
      desc: "Diverted over 15kg of plastics from local waterways and open landfills",
      icon: "🌊",
    },
    {
      title: "Zero-Waste Champion",
      titleMy: "စံပြ စွန့်ပစ်ခွဲခြားရေး ချန်ပီယံ",
      earned: (rewardProfile?.itemsRecycledCount || 0) >= 3,
      desc: "Completed 3 or more verified doorstep collections",
      icon: "🏅",
    },
    {
      title: "Metal Master",
      titleMy: "သတ္တုစွန့်ပစ် အထူးစုဆောင်းသူ",
      earned: (rewardProfile?.materialBreakdown?.metalKg || 0) >= 5,
      desc: "Recycled high-value scrap metal and aluminum cans",
      icon: "🥫",
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Citizen Header Profile */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Citizen Green Points Dashboard
            </h1>
            <Badge variant="eco" className="text-xs">
              Live Member
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Welcome back, <strong className="text-slate-800">{user?.name || rewardProfile?.name || "Citizen"}</strong>! View your total points, items recycled, and verified environmental footprint.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={loadDashboardData}
            disabled={refreshing}
            className="text-xs gap-1.5 bg-white shadow-2xs border-slate-200"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>

          <Link to="/request-pickup">
            <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-1.5 text-xs shadow-xs">
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Request</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* TOP: Core Summary & Dynamic Impact Statement */}
      <GreenPointsSummary profile={rewardProfile} loading={loading} />

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
          <TabsList className="bg-slate-100 p-1">
            <TabsTrigger value="impact" className="text-xs font-bold gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>Environmental Impact</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="text-xs font-bold gap-1.5">
              <Truck className="w-3.5 h-3.5 text-blue-600" />
              <span>Collection Requests ({collectionRequests.length})</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs font-bold gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Points Log ({rewardProfile?.transactions?.length || 0})</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="text-xs font-bold gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-600" />
              <span>Eco Badges</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Plastic 10 · Paper 5 · Glass 8 · Metal 15 pts/kg</span>
          </div>
        </div>

        {/* TAB 1: ENVIRONMENTAL IMPACT & POINTS CALCULATOR */}
        <TabsContent value="impact" className="space-y-8">
          {rewardProfile && <EnvironmentalImpactCard profile={rewardProfile} />}
          <PointsCalculatorWidget />
        </TabsContent>

        {/* TAB 2: COLLECTION REQUESTS LIST */}
        <TabsContent value="requests" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Recycling Requests</h3>
              <p className="text-xs text-slate-500">
                Track doorstep collections through pending, accepted, collected, and completed stages.
              </p>
            </div>
            <Link to="/request-pickup">
              <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold gap-1.5">
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Request</span>
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-slate-100 rounded-2xl"></div>
              ))}
            </div>
          ) : collectionRequests.length === 0 ? (
            <Card className="border-dashed border-2 border-slate-200 bg-white p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Truck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No Collection Requests Yet</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Ready to recycle? Create a request with your material type, quantity, and address. Verified collectors will pick it up and award you Green Points!
                </p>
              </div>
              <Link to="/request-pickup">
                <Button className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold gap-2">
                  <PlusCircle className="w-4 h-4" />
                  <span>Create First Request</span>
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collectionRequests.map((req) => (
                <Card
                  key={req.id}
                  className="border border-slate-200/90 bg-white hover:border-emerald-300 transition-all shadow-2xs overflow-hidden flex flex-col justify-between"
                >
                  <CardHeader className="p-4 bg-slate-50/60 border-b border-slate-100">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 block">
                          ID: {req.id}
                        </span>
                        <CardTitle className="text-sm font-bold text-slate-900 line-clamp-1">
                          {req.material}
                        </CardTitle>
                      </div>
                      <CollectionStatusBadge status={req.status} />
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Scale className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Quantity: <strong className="text-slate-900 font-semibold">{req.quantity}</strong></span>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{req.address}</span>
                      </div>

                      {req.description && (
                        <div className="flex items-start gap-2 text-slate-500 italic text-[11px] bg-slate-50 p-2 rounded-lg">
                          <FileText className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                          <span>"{req.description}"</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "Recent"}
                      </span>

                      {req.status === "COMPLETED" ? (
                        <span className="font-extrabold text-emerald-700 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                          <span>+{req.pointsAwarded || "Earned"} Green Points</span>
                        </span>
                      ) : (
                        <span className="font-medium text-slate-500">
                          {req.status === "PENDING"
                            ? "Awaiting Recycler"
                            : req.status === "ACCEPTED"
                            ? "Assigned to Recycler"
                            : "Collected (Pending Final Verification)"}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 3: POINTS TRANSACTION HISTORY LEDGER */}
        <TabsContent value="history" className="space-y-6">
          <PointsHistoryLedger
            transactions={rewardProfile?.transactions || []}
            loading={loading}
          />
        </TabsContent>

        {/* TAB 4: BADGES & REWARDS */}
        <TabsContent value="badges" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {citizenBadges.map((b, idx) => (
              <Card
                key={idx}
                className={`border transition-all ${
                  b.earned
                    ? "border-emerald-300 bg-white shadow-2xs"
                    : "border-slate-200 bg-slate-50/60 opacity-60"
                }`}
              >
                <CardContent className="p-5 space-y-3 text-center">
                  <div className="text-4xl">{b.icon}</div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">{b.title}</h4>
                    <p className="text-[11px] text-emerald-800 font-medium">{b.titleMy}</p>
                    <p className="text-xs text-slate-500 pt-1">{b.desc}</p>
                  </div>
                  <Badge variant={b.earned ? "success" : "outline"} className="text-[10px]">
                    {b.earned ? "Unlocked ✓" : "In Progress"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
