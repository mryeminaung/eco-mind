import React from "react";
import { FlagMyanmar, FlagUnitedKingdom } from "@/i18n/flags";
import { useLocale } from "@/i18n/LocaleContext";
import { cn } from "@/shared/utils";

export const LanguageToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { locale, setLocale, t } = useLocale();

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center rounded-xl border border-slate-200 bg-white p-0.5 shadow-xs",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        aria-label={t("lang.switchToEn")}
        className={cn(
          "inline-flex items-center gap-1.5 h-8 px-2 rounded-[10px] text-[11px] font-bold tracking-wide transition-colors",
          locale === "en"
            ? "bg-emerald-50 text-emerald-900"
            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
        )}
      >
        <FlagUnitedKingdom className="h-3.5 w-[21px] shrink-0 ring-1 ring-black/10 rounded-[2px]" />
        <span className="hidden sm:inline">{t("lang.en")}</span>
      </button>
      <button
        type="button"
        onClick={() => setLocale("my")}
        aria-pressed={locale === "my"}
        aria-label={t("lang.switchToMy")}
        className={cn(
          "inline-flex items-center gap-1.5 h-8 px-2 rounded-[10px] text-[11px] font-bold tracking-wide transition-colors",
          locale === "my"
            ? "bg-emerald-50 text-emerald-900"
            : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
        )}
      >
        <FlagMyanmar className="h-3.5 w-[21px] shrink-0 ring-1 ring-black/10 rounded-[2px]" />
        <span className="hidden sm:inline">{t("lang.my")}</span>
      </button>
    </div>
  );
};
