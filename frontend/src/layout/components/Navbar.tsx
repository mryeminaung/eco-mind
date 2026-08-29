import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Recycle,
  MapPin,
  Truck,
  PlusCircle,
  Menu,
  X,
  Building2,
  Users,
  LayoutDashboard,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Overview", path: "/" },
    { name: "AI Scanner", path: "/scan", badge: "AI" },
    { name: "Center Finder", path: "/centers" },
    { name: "Services", path: "/services" },
    { name: "Drop-off Hubs", path: "/hubs" },
    { name: "Community", path: "/community" },
    { name: "Citizen Portal", path: "/dashboard" },
    { name: "Collector Hub", path: "/collector" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-950/10 bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-700 transition-colors">
              <Recycle className="w-5 h-5 transition-transform group-hover:rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">
                  RecycleConnect
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                  Myanmar
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                အမှိုက်ခွဲခြားခြင်းနှင့် ပြန်လည်အသုံးချမှု ကွန်ရက်
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                location.pathname === link.path ||
                (link.path !== "/" && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-emerald-50 text-emerald-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.badge && (
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded-md">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>


          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/request-pickup">
              <Button variant="eco" size="sm" className="gap-2 shadow-sm">
                <PlusCircle className="w-4 h-4" />
                <span>Request Pickup</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link to="/request-pickup" className="sm:hidden">
              <Button size="sm" variant="eco" className="px-2.5 h-9">
                <PlusCircle className="w-4 h-4" />
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                    isActive
                      ? "bg-emerald-50 text-emerald-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.badge && <Sparkles className="w-4 h-4 text-emerald-600" />}
                    <span>{link.name}</span>
                  </span>
                  {link.badge && (
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-md">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/request-pickup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button variant="eco" className="w-full justify-center gap-2">
                <PlusCircle className="w-4 h-4" />
                <span>Request Doorstep Pickup</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
