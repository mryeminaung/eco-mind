import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  Edit3,
  Trash2,
  Copy,
  Check,
  Building2,
  PhoneCall,
} from "lucide-react";
import { Card, CardContent } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { RecyclingCenter } from "@/types";

interface RecyclingCenterCardProps {
  center: RecyclingCenter;
  isAdmin: boolean;
  onEdit: (center: RecyclingCenter) => void;
  onDelete: (center: RecyclingCenter) => void;
  selectedMaterial?: string;
}

// Material color badge mapping
const getMaterialBadgeStyle = (material: string) => {
  const m = material.toLowerCase();
  if (m.includes("plastic") || m.includes("pet")) {
    return "bg-amber-50 text-amber-800 border-amber-200/80";
  }
  if (m.includes("paper") || m.includes("cardboard")) {
    return "bg-blue-50 text-blue-800 border-blue-200/80";
  }
  if (m.includes("metal") || m.includes("aluminum") || m.includes("scrap")) {
    return "bg-slate-100 text-slate-800 border-slate-300/80";
  }
  if (m.includes("glass")) {
    return "bg-emerald-50 text-emerald-800 border-emerald-200/80";
  }
  if (m.includes("electronic") || m.includes("e-waste") || m.includes("batter")) {
    return "bg-purple-50 text-purple-800 border-purple-200/80";
  }
  if (m.includes("organic") || m.includes("compost") || m.includes("food")) {
    return "bg-lime-50 text-lime-900 border-lime-200/80";
  }
  if (m.includes("textile") || m.includes("fabric")) {
    return "bg-pink-50 text-pink-800 border-pink-200/80";
  }
  return "bg-slate-50 text-slate-700 border-slate-200";
};

export const RecyclingCenterCard: React.FC<RecyclingCenterCardProps> = ({
  center,
  isAdmin,
  onEdit,
  onDelete,
  selectedMaterial,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(center.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenMaps = () => {
    const query = encodeURIComponent(`${center.name}, ${center.location}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  return (
    <Card
      id={`center-card-${center.id}`}
      className="border border-slate-200/80 bg-white hover:border-emerald-500/80 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md group"
    >
      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Header with Title & Admin Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <Building2 className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-emerald-800 transition-colors">
                {center.name}
              </h3>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 pl-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="line-clamp-2">{center.location}</span>
            </p>
          </div>

          {isAdmin && (
            <Badge variant="warning" className="text-[10px] shrink-0 font-medium">
              Admin Managed
            </Badge>
          )}
        </div>

        {/* Operating Hours and Contact Details */}
        <div className="space-y-2 text-xs bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          <div className="flex items-center justify-between text-slate-700">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-medium">{center.openingHours}</span>
            </div>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100/70 text-emerald-800">
              Open to Public
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-700 pt-1 border-t border-slate-200/50">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold text-slate-900">{center.phone}</span>
            </div>
            <button
              onClick={handleCopyPhone}
              title="Copy phone number"
              className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" /> Copied
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" /> Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Accepted Materials Stream */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Accepted Materials:
            </span>
            <span className="text-[11px] text-slate-400">
              {center.acceptedMaterials.length} types
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {center.acceptedMaterials.map((mat) => {
              const isHighlighted =
                selectedMaterial &&
                selectedMaterial.toLowerCase() !== "all" &&
                mat.toLowerCase().includes(selectedMaterial.toLowerCase());
              return (
                <span
                  key={mat}
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${
                    getMaterialBadgeStyle(mat)
                  } ${isHighlighted ? "ring-2 ring-emerald-500 font-semibold" : ""}`}
                >
                  {mat}
                </span>
              );
            })}
          </div>
        </div>
      </CardContent>

      {/* Action Footer */}
      <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 mt-2">
        <div className="flex flex-wrap items-center gap-2 pt-3">
          {/* User actions */}
          <Button
            id={`btn-directions-${center.id}`}
            variant="outline"
            size="sm"
            className="flex-1 text-xs gap-1.5 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300"
            onClick={handleOpenMaps}
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            <span>Get Directions</span>
          </Button>

          <a href={`tel:${center.phone}`} className="flex-1">
            <Button
              id={`btn-call-${center.id}`}
              variant="secondary"
              size="sm"
              className="w-full text-xs gap-1.5 font-semibold"
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-700" />
              <span>Call Center</span>
            </Button>
          </a>

          {/* Admin actions if Admin Mode is enabled */}
          {isAdmin && (
            <div className="w-full flex items-center gap-2 pt-2 border-t border-dashed border-slate-200 mt-1">
              <Button
                id={`btn-edit-${center.id}`}
                variant="outline"
                size="sm"
                className="flex-1 text-xs gap-1.5 text-blue-700 border-blue-200 hover:bg-blue-50"
                onClick={() => onEdit(center)}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Center</span>
              </Button>

              <Button
                id={`btn-delete-${center.id}`}
                variant="outline"
                size="sm"
                className="flex-1 text-xs gap-1.5 text-rose-700 border-rose-200 hover:bg-rose-50"
                onClick={() => onDelete(center)}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
