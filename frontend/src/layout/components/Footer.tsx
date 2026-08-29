import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, PhoneCall, Mail, MapPin } from "lucide-react";
import { BrandLogo } from "@/shared/components/BrandLogo";
import { useLocale } from "@/i18n/LocaleContext";

export const Footer: React.FC = () => {
  const { t } = useLocale();

  const citizenLinks = [
    { to: "/request-pickup", labelKey: "footer.pickup" },
    { to: "/hubs", labelKey: "footer.hubs" },
    { to: "/rewards", labelKey: "footer.rewards" },
    { to: "/community", labelKey: "footer.community" },
  ];

  const partnerLinks = [
    { to: "/services", labelKey: "footer.directory" },
    { to: "/collector", labelKey: "footer.portal" },
    { to: "/centers", labelKey: "footer.centers" },
    { to: "/scan", labelKey: "footer.scan" },
  ];

  return (
    <footer className="pt-4 pb-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white p-8 sm:p-10">
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Link to="/" className="inline-flex">
              <BrandLogo size="sm" />
            </Link>
            <p className="text-sm text-emerald-100/75 leading-relaxed max-w-xs">
              {t("footer.blurb")}
            </p>
            <p className="inline-flex text-[11px] font-semibold text-emerald-100 bg-white/10 border border-white/10 rounded-full px-2.5 py-1">
              {t("footer.nationwide")}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-300/80">
              {t("footer.citizens")}
            </h4>
            <ul className="space-y-2 text-sm text-emerald-50/85">
              {citizenLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-white transition-colors">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-300/80">
              {t("footer.partners")}
            </h4>
            <ul className="space-y-2 text-sm text-emerald-50/85">
              {partnerLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="hover:text-white transition-colors">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-300/80">
              {t("footer.support")}
            </h4>
            <div className="space-y-2.5 text-sm text-emerald-50/85">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-lima-400 shrink-0 mt-0.5" />
                <span>{t("footer.cities")}</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-lima-400 shrink-0" />
                <span>+95 9 795 888 123</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-lima-400 shrink-0" />
                <span>support@ecomind.mm</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-200/70">
          <p>{t("footer.copyright", { year: new Date().getFullYear() })}</p>
          <p className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-lima-400" />
            {t("footer.verified")}
          </p>
        </div>
      </div>
    </footer>
  );
};
