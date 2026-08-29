import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ScanLine,
  MapPin,
  Truck,
  Gift,
  BarChart3,
  Layers,
  Building2,
  Shield,
  Settings,
  LogIn,
  X,
} from "lucide-react";
import { BrandLogo } from "@/shared/components/BrandLogo";
import { useAuth } from "@/features/auth/AuthContext";
import { useLocale } from "@/i18n/LocaleContext";
import { UserRole } from "@/types";

type NavItem = {
  labelKey: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | null;
  exact?: boolean;
  roles: Array<UserRole | "GUEST">;
};

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLocale();

  const viewer: UserRole | "GUEST" = user?.role ?? "GUEST";

  const canSee = (roles: Array<UserRole | "GUEST">) => roles.includes(viewer);

  const citizenLinks: NavItem[] = [
    { labelKey: "nav.overview", path: "/dashboard", icon: Home, exact: true, roles: ["USER"] },
    { labelKey: "nav.rewards", path: "/rewards", icon: Gift, exact: true, roles: ["USER"] },
    { labelKey: "nav.scan", path: "/scan", icon: ScanLine, roles: ["USER"] },
    { labelKey: "nav.centers", path: "/centers", icon: MapPin, roles: ["USER"] },
    { labelKey: "nav.collections", path: "/request-pickup", icon: Truck, roles: ["USER"] },
  ];

  const partnerLinks: NavItem[] = [
    { labelKey: "nav.collector", path: "/collector", icon: BarChart3, roles: ["RECYCLER"] },
    { labelKey: "nav.centers", path: "/centers", icon: MapPin, roles: ["RECYCLER"] },
    { labelKey: "nav.services", path: "/services", icon: Layers, roles: ["RECYCLER", "GUEST"] },
    { labelKey: "nav.hubs", path: "/hubs", icon: Building2, roles: ["RECYCLER", "GUEST"] },
  ];

  const adminLinks: NavItem[] = [
    { labelKey: "nav.overview", path: "/overview", icon: Home, exact: true, roles: ["ADMIN"] },
    { labelKey: "nav.centers", path: "/centers", icon: MapPin, roles: ["ADMIN"] },
    { labelKey: "nav.users", path: "/admin/users", icon: Shield, roles: ["ADMIN"] },
  ];

  const accountLinks: NavItem[] = [
    { labelKey: "nav.settings", path: "/settings", icon: Settings, roles: ["USER", "RECYCLER", "ADMIN"] },
  ];

  const visibleCitizen = citizenLinks.filter((link) => canSee(link.roles));
  const visiblePartner = partnerLinks.filter((link) => canSee(link.roles));
  const visibleAdmin = adminLinks.filter((link) => canSee(link.roles));
  const visibleAccount = accountLinks.filter((link) => canSee(link.roles));

  const isLinkActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    if (path.includes("#")) {
      const basePath = path.split("#")[0];
      return location.pathname === basePath;
    }
    return location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
  };

  const renderNavLink = (item: {
    labelKey: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | null;
    exact?: boolean;
  }) => {
    const Icon = item.icon;
    const active = isLinkActive(item.path, item.exact);

    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={onCloseMobile}
        className={`group flex items-center justify-between px-2.5 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
          active
            ? "bg-white/[0.12] text-white font-semibold"
            : "text-emerald-100/80 hover:text-white hover:bg-white/[0.08]"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              active ? "bg-lima-400/20" : "bg-white/[0.06] group-hover:bg-white/10"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                active ? "text-lima-300" : "text-emerald-200/80 group-hover:text-lima-300"
              }`}
            />
          </span>
          <span className="truncate">{t(item.labelKey)}</span>
        </div>

        {item.badge && (
          <span
            className={`w-5 h-5 rounded-full text-[11px] font-extrabold flex items-center justify-center shrink-0 ${
              active ? "bg-lima-400/25 text-lima-200" : "bg-lima-400 text-lima-950"
            }`}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="w-64 h-full flex flex-col justify-between bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white px-4 pb-5 select-none overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="space-y-6">
        <div className="h-16 -mx-4 px-4 flex items-center justify-between border-b border-white/10">
          <Link
            to="/"
            onClick={onCloseMobile}
            className="flex-1 min-w-0 flex items-center justify-center rounded-xl bg-white px-3 py-1.5"
          >
            <BrandLogo className="h-9 w-full max-w-none" />
          </Link>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl text-emerald-300 hover:text-white hover:bg-white/10"
              aria-label={t("nav.closeSidebar")}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-5 pt-2">
          {visibleCitizen.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="text-[11px] font-extrabold text-emerald-400/70 uppercase tracking-[0.16em] px-3.5 pb-1">
                {t("nav.section.citizen")}
              </h2>
              <div className="space-y-1">
                {visibleCitizen.map((link) => renderNavLink(link))}
              </div>
            </div>
          )}

          {visiblePartner.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="text-[11px] font-extrabold text-emerald-400/70 uppercase tracking-[0.16em] px-3.5 pb-1">
                {t("nav.section.partner")}
              </h2>
              <div className="space-y-1">
                {visiblePartner.map((link) => renderNavLink(link))}
              </div>
            </div>
          )}

          {visibleAdmin.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="text-[11px] font-extrabold text-emerald-400/70 uppercase tracking-[0.16em] px-3.5 pb-1">
                {t("nav.section.admin")}
              </h2>
              <div className="space-y-1">
                {visibleAdmin.map((link) => renderNavLink(link))}
              </div>
            </div>
          )}

          {visibleAccount.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="text-[11px] font-extrabold text-emerald-400/70 uppercase tracking-[0.16em] px-3.5 pb-1">
                {t("nav.section.account")}
              </h2>
              <div className="space-y-1">
                {visibleAccount.map((link) => renderNavLink(link))}
              </div>
            </div>
          )}
        </nav>
      </div>

      {!user && (
        <div className="pt-6 mt-4 border-t border-emerald-900/40">
          <Link
            to="/"
            onClick={onCloseMobile}
            className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/[0.06] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-800 text-lima-400 flex items-center justify-center shrink-0">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">{t("nav.getStarted")}</p>
              <p className="text-[11px] text-emerald-300/70">{t("nav.landingFirst")}</p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
};
