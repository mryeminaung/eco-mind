import React from "react";
import { WasteCategory } from "@/types";
import { Badge } from "../ui/badge";
import { useLocale } from "@/i18n/LocaleContext";
import {
  Package,
  FileText,
  Cpu,
  ShieldAlert,
  Wine,
  Apple,
  Shirt,
} from "lucide-react";

interface Props {
  category: WasteCategory;
  showIcon?: boolean;
}

export const categoryMeta: Record<
  WasteCategory,
  { label: string; labelMy: string; color: string; icon: any; buyRate: string }
> = {
  plastic: {
    label: "Plastic",
    labelMy: "ပလတ်စတစ်",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Package,
    buyRate: "350 - 500 MMK/kg",
  },
  paper: {
    label: "Paper & Cardboard",
    labelMy: "စက္ကူနှင့် ဂျိုကာ",
    color: "bg-amber-50 text-amber-800 border-amber-200",
    icon: FileText,
    buyRate: "300 - 450 MMK/kg",
  },
  metal: {
    label: "Scrap Metal",
    labelMy: "သံတိုသံစ / အလူမီနီယမ်",
    color: "bg-slate-100 text-slate-800 border-slate-300",
    icon: ShieldAlert,
    buyRate: "1,500 - 2,200 MMK/kg",
  },
  electronic: {
    label: "E-Waste",
    labelMy: "အီလက်ထရောနစ် စွန့်ပစ်",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Cpu,
    buyRate: "1,000 - 2,500 MMK/kg",
  },
  glass: {
    label: "Glass Bottles",
    labelMy: "ဖန်ပုလင်း",
    color: "bg-teal-50 text-teal-700 border-teal-200",
    icon: Wine,
    buyRate: "150 - 250 MMK/kg",
  },
  organic: {
    label: "Organic Compost",
    labelMy: "သဘာဝမြေဆွေး / အကြွင်းအကျန်",
    color: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: Apple,
    buyRate: "Eco Points / Bio-Fertilizer",
  },
  textile: {
    label: "Textiles / Fabric",
    labelMy: "အဝတ်အထည်ဟောင်း",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    icon: Shirt,
    buyRate: "200 - 350 MMK/kg",
  },
};

export const WasteCategoryBadge: React.FC<Props> = ({ category, showIcon = true }) => {
  const { locale } = useLocale();
  const meta = categoryMeta[category] || {
    label: category,
    labelMy: "",
    color: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Package,
    buyRate: "",
  };
  const Icon = meta.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${meta.color}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      <span>{locale === "my" && meta.labelMy ? meta.labelMy : meta.label}</span>
    </span>
  );
};
