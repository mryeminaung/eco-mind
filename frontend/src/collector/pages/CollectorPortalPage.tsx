import React, { useEffect, useState } from "react";
import {
  Truck,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Scale,
  RefreshCw,
  AlertCircle,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Select } from "@/shared/ui/select";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { PickupRequestCard } from "@/shared/components/PickupRequestCard";
import { PickupRequest, PickupStatus } from "@/types";
import { api } from "@/shared/api";
import { formatWeight } from "@/shared/utils";

export const CollectorPortalPage: React.FC = () => {
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const fetchPickups = async () => {
    try {
      const data = await api.getPickups({
        city: selectedCity,
        status: selectedStatus,
      });
      setPickups(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPickups();
  }, [selectedCity, selectedStatus]);

  const handleStatusChange = async (
    id: string,
    newStatus: PickupStatus,
    actualWeightKg?: number
  ) => {
    try {
      await api.updatePickupStatus(id, {
        status: newStatus,
        assignedCollectorId: "rec-1",
        assignedCollectorName: "Yangon Central Collector Hub",
        actualWeightKg,
      });
      fetchPickups();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const pendingCount = pickups.filter((p) => p.status === "pending").length;
  const assignedCount = pickups.filter((p) => p.status === "assigned" || p.status === "in_transit").length;
  const completedCount = pickups.filter((p) => p.status === "completed").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Recycling Collector & Dispatch Hub
            </h1>
            <Badge variant="eco" className="text-xs">
              Collector Workspace
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            Accept open citizen pickup requests, assign neighborhood routes, and submit final scale weights.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setRefreshing(true);
            fetchPickups();
          }}
          disabled={refreshing}
          className="gap-2 text-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          <span>Refresh Live Queue</span>
        </Button>
      </div>

      {/* Collector Stat summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-amber-200 bg-amber-50/40">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                Unassigned Requests
              </span>
              <p className="text-2xl font-black text-amber-950">{pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-500/80" />
          </CardContent>
        </Card>

        <Card className="border border-sky-200 bg-sky-50/40">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
                In Dispatch / On Route
              </span>
              <p className="text-2xl font-black text-sky-950">{assignedCount}</p>
            </div>
            <Truck className="w-8 h-8 text-sky-500/80" />
          </CardContent>
        </Card>

        <Card className="border border-emerald-200 bg-emerald-50/40">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Processed & Weighed
              </span>
              <p className="text-2xl font-black text-emerald-950">{completedCount}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-500/80" />
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border border-slate-200/80 bg-white">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Filter by Region / City:
              </label>
              <Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="All">All Myanmar Cities</option>
                <option value="Yangon">Yangon (ရန်ကုန်)</option>
                <option value="Mandalay">Mandalay (မန္တလေး)</option>
                <option value="Naypyidaw">Naypyidaw (နေပြည်တော်)</option>
                <option value="Bago">Bago (ပဲခူး)</option>
                <option value="Mawlamyine">Mawlamyine (မော်လမြိုင်)</option>
                <option value="Taunggyi">Taunggyi (တောင်ကြီး)</option>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Status Queue:
              </label>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Pickup Statuses</option>
                <option value="pending">Pending Collector Only</option>
                <option value="assigned">Collector Assigned</option>
                <option value="in_transit">In-Transit</option>
                <option value="completed">Completed & Weighed</option>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queue List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-slate-200/60 rounded-2xl"></div>
          ))}
        </div>
      ) : pickups.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
          <p className="text-base font-semibold text-slate-700">No pickup requests match criteria</p>
          <p className="text-xs text-slate-500">
            Try switching to "All Myanmar Cities" or check back shortly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pickups.map((pickup) => (
            <PickupRequestCard
              key={pickup.id}
              pickup={pickup}
              isCollectorView={true}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};
