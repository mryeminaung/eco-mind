import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils";

export type PageSectionPill = {
  id: string;
  label: string;
  prefix?: string;
  active?: boolean;
  onClick?: () => void;
};

interface PageSectionHeaderProps {
  title: string;
  description?: string;
  pills?: PageSectionPill[];
  actions?: React.ReactNode;
  icon?: LucideIcon;
}

export const PageSectionHeader: React.FC<PageSectionHeaderProps> = ({
  title,
  description,
  pills,
  actions,
  icon: Icon,
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white p-6 sm:p-8">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        <div className="max-w-2xl space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{title}</h1>
          {description && (
            <p className="text-sm sm:text-base text-emerald-100/85 leading-relaxed">{description}</p>
          )}
          {pills && pills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {pills.map((pill, index) => {
                const className = cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                  pill.active
                    ? "bg-lima-400 text-emerald-950 border-lima-400"
                    : "bg-white/10 border-white/10 text-emerald-50 hover:bg-white/15",
                );
                const body = (
                  <>
                    <span className={pill.active ? "text-emerald-900" : "text-lima-400"}>
                      {pill.prefix ?? String(index + 1)}
                    </span>
                    {pill.label}
                  </>
                );
                if (pill.onClick) {
                  return (
                    <button key={pill.id} type="button" onClick={pill.onClick} className={className}>
                      {body}
                    </button>
                  );
                }
                return (
                  <span key={pill.id} className={className}>
                    {body}
                  </span>
                );
              })}
            </div>
          )}
        </div>
        {actions && <div className="relative z-10 shrink-0">{actions}</div>}
      </div>
      {Icon && (
        <Icon className="absolute -right-6 -bottom-8 w-48 h-48 text-emerald-200/15 pointer-events-none hidden sm:block" />
      )}
    </section>
  );
};
