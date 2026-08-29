import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Menu, MapPin } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { UserMenu } from "./UserMenu";
import { LanguageToggle } from "./LanguageToggle";
import { BrandLogo } from "@/shared/components/BrandLogo";
import { useAuth } from "@/features/auth/AuthContext";
import { useLocale } from "@/i18n/LocaleContext";

export const DashboardLayout: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();
  const { signingOut } = useAuth();
  const { t } = useLocale();

  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileDrawerOpen]);

  if (signingOut) {
    return <div className="min-h-screen bg-lima-50" />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 selection:bg-emerald-200 selection:text-emerald-950 font-sans antialiased">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-40">
        <Sidebar />
      </div>

      {/* Mobile Drawer (Slide-in Sidebar with dark backdrop) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileDrawerOpen(false)}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            <Sidebar onCloseMobile={() => setMobileDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
          <div className="max-w-7xl mx-auto w-full h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left section: Mobile toggle or Desktop subtle greeting/breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label={t("nav.openSidebar")}
            >
              <Menu className="w-6 h-6 text-slate-800" />
            </button>

            {/* Mobile Brand Title */}
            <Link to="/" className="flex lg:hidden items-center">
              <BrandLogo size="sm" className="rounded-md bg-black" />
            </Link>

            {/* Desktop Status & Region Tag */}
            <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-full border border-emerald-200/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t("header.networkActive")}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {t("header.regions")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <UserMenu />
          </div>
          </div>
        </header>

        {/* Primary Page Outlet */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
