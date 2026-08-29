import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon, Recycle } from "lucide-react";
import { BrandLogo } from "@/shared/components/BrandLogo";
import { LanguageToggle } from "@/layout/components/LanguageToggle";
import { useLocale } from "@/i18n/LocaleContext";

interface AuthSplitLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  points: { icon: LucideIcon; text: string }[];
  children: React.ReactNode;
}

export const AuthSplitLayout: React.FC<AuthSplitLayoutProps> = ({
  eyebrow,
  title,
  description,
  points,
  children,
}) => {
  const { t } = useLocale();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      <aside className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white px-6 py-8 sm:px-10 sm:py-12 lg:px-14 lg:py-16 flex flex-col justify-between min-h-[42vh] lg:min-h-screen">
        <div className="relative z-10 space-y-8 max-w-lg">
          <Link to="/" className="inline-flex rounded-xl bg-white px-3 py-2">
            <BrandLogo size="lg" />
          </Link>
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-lima-300">{eyebrow}</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">{title}</h1>
            <p className="text-sm sm:text-base text-emerald-100/85 leading-relaxed">{description}</p>
          </div>
          <ul className="space-y-3">
            {points.map((point) => (
              <li key={point.text} className="flex items-start gap-3 text-sm text-emerald-50/90">
                <span className="mt-0.5 w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                  <point.icon className="w-4 h-4 text-lima-400" />
                </span>
                <span className="pt-1.5 leading-relaxed">{point.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 mt-8 text-xs text-emerald-200/70">
          {t("auth.nationwide")}
        </p>
        <Recycle className="absolute -right-10 -bottom-10 w-64 h-64 text-emerald-200/10 pointer-events-none hidden sm:block" />
      </aside>

      <div className="bg-lima-50 flex flex-col items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-md flex justify-end mb-6">
          <LanguageToggle />
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};
