import React from "react";
import { CollectionStatus } from "@/types";
import { Clock, CheckCircle2, Truck, Check, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: CollectionStatus;
  size?: "sm" | "md" | "lg";
}

export const CollectionStatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  const configMap: Record<
    CollectionStatus,
    {
      label: string;
      bg: string;
      text: string;
      border: string;
      icon: React.ComponentType<{ className?: string }>;
      dot: string;
    }
  > = {
    PENDING: {
      label: "Pending",
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      icon: Clock,
      dot: "bg-amber-500",
    },
    ACCEPTED: {
      label: "Accepted",
      bg: "bg-blue-50",
      text: "text-blue-800",
      border: "border-blue-200",
      icon: CheckCircle2,
      dot: "bg-blue-500",
    },
    COLLECTED: {
      label: "Collected",
      bg: "bg-purple-50",
      text: "text-purple-800",
      border: "border-purple-200",
      icon: Truck,
      dot: "bg-purple-500",
    },
    COMPLETED: {
      label: "Completed",
      bg: "bg-emerald-50",
      text: "text-emerald-800",
      border: "border-emerald-200",
      icon: Check,
      dot: "bg-emerald-500",
    },
    REJECTED: {
      label: "Rejected",
      bg: "bg-rose-50",
      text: "text-rose-800",
      border: "border-rose-200",
      icon: AlertCircle,
      dot: "bg-rose-500",
    },
  };

  const config = configMap[status] || {
    label: status,
    bg: "bg-slate-100",
    text: "text-slate-800",
    border: "border-slate-200",
    icon: AlertCircle,
    dot: "bg-slate-400",
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 gap-1.5",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3.5 py-1.5 gap-2",
  }[size];

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  }[size];

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} transition-colors select-none`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <Icon className={iconSizes} />
      <span>{config.label}</span>
    </span>
  );
};
