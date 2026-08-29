import React from "react";
import { PickupRequest, PickupStatus } from "@/types";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { WasteCategoryBadge } from "./WasteCategoryBadge";
import { formatWeight, formatCurrency } from "@/shared/utils";
import {
  MapPin,
  Calendar,
  Clock,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
} from "lucide-react";

interface Props {
  pickup: PickupRequest;
  onStatusChange?: (id: string, newStatus: PickupStatus, actualWeightKg?: number) => void;
  isCollectorView?: boolean;
}

export const statusBadgeMap: Record<
  PickupStatus,
  { label: string; labelMy: string; variant: "default" | "secondary" | "outline" | "warning" | "destructive" | "info" }
> = {
  pending: { label: "Pending Collector", labelMy: "သိမ်းဆည်းသူစောင့်ဆိုင်းဆဲ", variant: "warning" },
  assigned: { label: "Collector Assigned", labelMy: "တာဝန်ပေးအပ်ပြီး", variant: "info" },
  in_transit: { label: "On The Way", labelMy: "လာယူရန်လမ်းခရီးတွင်", variant: "secondary" },
  completed: { label: "Recycled & Paid", labelMy: "အောင်မြင်စွာ သိမ်းဆည်းပြီး", variant: "default" },
  cancelled: { label: "Cancelled", labelMy: "ပယ်ဖျက်ပြီး", variant: "destructive" },
};

export const PickupRequestCard: React.FC<Props> = ({
  pickup,
  onStatusChange,
  isCollectorView = false,
}) => {
  const statusInfo = statusBadgeMap[pickup.status] || {
    label: pickup.status,
    labelMy: "",
    variant: "outline" as const,
  };

  return (
    <Card className="border border-slate-200/80 bg-white hover:border-emerald-300">
      <CardContent className="p-5 space-y-4">
        {/* Header: Citizen & Status */}
        <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base">
                {pickup.citizenName}
              </span>
              <span className="text-xs text-slate-400 font-mono">#{pickup.id.slice(-6)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{pickup.citizenPhone}</span>
            </div>
          </div>
          <Badge variant={statusInfo.variant} className="text-xs font-semibold px-2.5 py-1">
            {statusInfo.label}
          </Badge>
        </div>

        {/* Location & Time details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">
                {pickup.township}, {pickup.city}
              </p>
              <p className="text-slate-500">{pickup.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">
                {pickup.preferredDate} ({pickup.preferredTimeSlot.toUpperCase()})
              </p>
              <p className="text-slate-500">
                Created {new Date(pickup.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Waste Items Breakdown */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Recyclable Materials ({formatWeight(pickup.totalEstimatedWeightKg)})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {pickup.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 bg-slate-100/70 px-2 py-1 rounded-lg text-xs">
                <WasteCategoryBadge category={item.category} />
                <span className="font-semibold text-slate-700">~{item.estimatedWeightKg}kg</span>
              </div>
            ))}
          </div>
          {pickup.notes && (
            <p className="text-xs text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100/80">
              Note: "{pickup.notes}"
            </p>
          )}
        </div>

        {/* Rewards / Value calculation */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="text-slate-600">
            Est. Buyback: <span className="font-bold text-emerald-700">{formatCurrency(pickup.rewardMmk || 0)}</span>
          </div>
          <div className="text-slate-600">
            Eco Points: <span className="font-bold text-teal-700">+{pickup.ecoPointsEarned || 0} pts</span>
          </div>
        </div>

        {/* Collector action buttons */}
        {isCollectorView && onStatusChange && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 justify-end">
            {pickup.status === "pending" && (
              <Button
                size="sm"
                variant="eco"
                onClick={() => onStatusChange(pickup.id, "assigned")}
                className="text-xs gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" /> Accept & Dispatch Pickup
              </Button>
            )}

            {pickup.status === "assigned" && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onStatusChange(pickup.id, "in_transit")}
                className="text-xs gap-1.5"
              >
                <Truck className="w-3.5 h-3.5" /> Mark In-Transit
              </Button>
            )}

            {pickup.status === "in_transit" && (
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  const weightPrompt = window.prompt(
                    `Enter measured scale weight in KG (Estimated was ${pickup.totalEstimatedWeightKg}kg):`,
                    pickup.totalEstimatedWeightKg.toString()
                  );
                  const actual = weightPrompt ? parseFloat(weightPrompt) : pickup.totalEstimatedWeightKg;
                  onStatusChange(pickup.id, "completed", actual);
                }}
                className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Weigh & Complete
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
