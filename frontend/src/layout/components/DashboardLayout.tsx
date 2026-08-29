import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  Menu,
  PlusCircle,
  Sparkles,
  MapPin,
  Bell,
  Search,
  CheckCircle2,
} from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Button } from "@/shared/ui/button";
import { BrandLogo } from "@/shared/components/BrandLogo";
import { useAuth } from "@/auth/AuthContext";

export const DashboardLayout: React.FC = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile drawer is open
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
      <div className="flex-1 lg:pl-72 2xl:pl-80 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
          {/* Left section: Mobile toggle or Desktop subtle greeting/breadcrumb */}
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Open sidebar navigation"
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
                <span>Myanmar Eco Network Active</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Yangon, Mandalay & 14 Regions
              </span>
            </div>
          </div>

          {/* Right section: Quick Action Buttons */}
          <div className="flex items-center gap-2.5">
            {(!user || user.role === "USER" || user.role === "ADMIN") && (
              <Link to="/scan" className="hidden sm:inline-flex">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1.5 border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AI Waste Scanner</span>
                </Button>
              </Link>
            )}

            {user?.role === "RECYCLER" ? (
              <Link to="/collector">
                <Button
                  size="sm"
                  className="text-xs gap-1.5 font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                >
                  <PlusCircle className="w-4 h-4 text-lima-400" />
                  <span>Pickup Queue</span>
                </Button>
              </Link>
            ) : user ? (
              <Link to="/request-pickup">
                <Button
                  id="btn-top-request-pickup"
                  size="sm"
                  className="text-xs gap-1.5 font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                >
                  <PlusCircle className="w-4 h-4 text-lima-400" />
                  <span className="hidden sm:inline">Request Pickup</span>
                  <span className="sm:hidden">Pickup</span>
                </Button>
              </Link>
            ) : (
              <Link to="/">
                <Button
                  size="sm"
                  className="text-xs gap-1.5 font-semibold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                >
                  Get started
                </Button>
              </Link>
            )}
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
