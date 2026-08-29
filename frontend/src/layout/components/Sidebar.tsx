import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Recycle,
  Home,
  ScanLine,
  MapPin,
  Truck,
  Gift,
  BarChart3,
  Layers,
  Building2,
  Users,
  Shield,
  LogIn,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "@/auth/AuthContext";

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const citizenLinks = [
    {
      name: "Overview",
      path: "/overview",
      icon: Home,
      exact: true,
    },
    {
      name: "AI Waste Scanner",
      path: "/scan",
      icon: ScanLine,
      badge: null,
    },
    {
      name: "Recycling Centers",
      path: "/centers",
      icon: MapPin,
      badge: null,
    },
    {
      name: "My Collections",
      path: "/request-pickup",
      icon: Truck,
      badge: "1",
    },
    {
      name: "Green Rewards",
      path: "/dashboard#rewards",
      icon: Gift,
      badge: null,
    },
  ];

  const partnerLinks = [
    {
      name: "Recycler Dashboard",
      path: "/collector",
      icon: BarChart3,
      badge: null,
    },
    {
      name: "Recycling Services",
      path: "/services",
      icon: Layers,
      badge: null,
    },
    {
      name: "Drop-off Hubs",
      path: "/hubs",
      icon: Building2,
      badge: null,
    },
  ];

  const adminLinks = [
    {
      name: "Manage Users",
      path: "/admin/users",
      icon: Shield,
      badge: null,
    },
  ];

  const communityLinks = [
    {
      name: "Community Impact",
      path: "/community",
      icon: Users,
      badge: null,
    },
  ];

  const showCitizen = !user || user.role === "USER" || user.role === "ADMIN";
  const showPartner = !user || user.role === "RECYCLER" || user.role === "ADMIN";
  const showAdmin = user?.role === "ADMIN";

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
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | null;
    exact?: boolean;
  }) => {
    const Icon = item.icon;
    const active = isLinkActive(item.path, item.exact);

    return (
      <Link
        key={item.name}
        to={item.path}
        onClick={onCloseMobile}
        className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
          active
            ? "bg-lima-800 text-white shadow-inner font-semibold ring-1 ring-emerald-600/40"
            : "text-emerald-100/80 hover:text-white hover:bg-white/[0.06]"
        }`}
      >
        {/* Left active glowing indicator border */}
        {active && (
          <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-lima-400 rounded-r-full shadow-[0_0_8px_#85e437]" />
        )}

        <div className="flex items-center gap-3">
          <Icon
            className={`w-5 h-5 transition-colors ${
              active
                ? "text-lima-400"
                : "text-emerald-300/70 group-hover:text-lima-400"
            }`}
          />
          <span className="truncate">{item.name}</span>
        </div>

        {item.badge && (
          <span className="w-5 h-5 rounded-full bg-lima-400 text-lima-950 text-[11px] font-extrabold flex items-center justify-center shrink-0 shadow-xs">
            {item.badge}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside className="w-72 2xl:w-80 h-full flex flex-col justify-between bg-gradient-to-b from-lima-900 via-lima-950 to-lima-950 text-white p-5 select-none overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-900/50">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center justify-between pt-1">
          <Link
            to="/"
            onClick={onCloseMobile}
            className="flex items-center gap-3.5 group"
          >
            {/* Lime Logo Box */}
            <div className="w-12 h-12 rounded-2xl bg-lima-400 flex items-center justify-center text-lima-950 shadow-md group-hover:scale-105 transition-transform">
              <Recycle className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div>
              <h1 className="font-extrabold text-white text-lg sm:text-xl tracking-tight leading-tight">
                RecycleConnect
              </h1>
              <p className="text-[11px] font-bold text-emerald-400 tracking-[0.2em] uppercase">
                MYANMAR
              </p>
            </div>
          </Link>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl text-emerald-300 hover:text-white hover:bg-white/10"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="space-y-5 pt-2">
          {showCitizen && (
            <div className="space-y-1.5">
              <h2 className="text-[11px] font-extrabold text-emerald-400/70 uppercase tracking-[0.16em] px-3.5 pb-1">
                CITIZEN SPACE
              </h2>
              <div className="space-y-1">
                {citizenLinks.map((link) => renderNavLink(link))}
              </div>
            </div>
          )}

          {showPartner && (
            <div className="space-y-1.5">
              <h2 className="text-[11px] font-extrabold text-emerald-400/70 uppercase tracking-[0.16em] px-3.5 pb-1">
                PARTNER SPACE
              </h2>
              <div className="space-y-1">
                {partnerLinks.map((link) => renderNavLink(link))}
              </div>
            </div>
          )}

          {showAdmin && (
            <div className="space-y-1.5">
              <h2 className="text-[11px] font-extrabold text-emerald-400/70 uppercase tracking-[0.16em] px-3.5 pb-1">
                ADMIN
              </h2>
              <div className="space-y-1">
                {adminLinks.map((link) => renderNavLink(link))}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <h2 className="text-[11px] font-extrabold text-emerald-400/70 uppercase tracking-[0.16em] px-3.5 pb-1">
              COMMUNITY
            </h2>
            <div className="space-y-1">
              {communityLinks.map((link) => renderNavLink(link))}
            </div>
          </div>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4 pt-6 mt-4 border-t border-emerald-900/40">
        {/* Monthly green goal widget */}
        <div className="bg-lima-800/90 border border-emerald-700/30 rounded-2xl p-4 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-200/90 font-medium">
              Monthly green goal
            </span>
            <span className="text-xl font-black text-lima-400 tracking-tight">
              68%
            </span>
          </div>

          {/* Progress Bar with Lime fill */}
          <div className="w-full bg-lima-950 h-2 rounded-full overflow-hidden p-0.5 border border-emerald-900/40">
            <div
              className="bg-lima-400 h-full rounded-full transition-all duration-500 shadow-[0_0_8px_#85e437]"
              style={{ width: "68%" }}
            />
          </div>
        </div>

        {user ? (
          <div className="space-y-2">
            <Link
              to={user.role === "RECYCLER" ? "/collector" : user.role === "ADMIN" ? "/admin/users" : "/dashboard"}
              onClick={onCloseMobile}
              className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/[0.06] transition-colors group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-lima-200 text-lima-950 font-black text-sm flex items-center justify-center shrink-0 shadow-sm ring-2 ring-emerald-500/30 group-hover:ring-lima-400 transition-all">
                {user.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-white text-sm leading-tight truncate group-hover:text-lima-400 transition-colors">
                  {user.name}
                </p>
                <p className="text-[11px] text-emerald-300/70 truncate">
                  {user.role} • {user.points} pts
                </p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                onCloseMobile?.();
                navigate("/");
              }}
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm text-emerald-100/80 hover:text-white hover:bg-white/[0.06]"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        ) : (
          <Link
            to="/"
            onClick={onCloseMobile}
            className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-white/[0.06] transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-800 text-lima-400 flex items-center justify-center shrink-0">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Get started</p>
              <p className="text-[11px] text-emerald-300/70">Landing page first</p>
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
};
