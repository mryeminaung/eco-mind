import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Recycle,
  LogIn,
  UserPlus,
  ScanLine,
  MapPin,
  Truck,
  Coins,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { roleHomePath, useAuth } from "@/auth/AuthContext";

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const appPath = roleHomePath(user?.role);
  const nextPath = (location.state as { from?: string } | null)?.from;
  const authState = nextPath ? { from: nextPath } : undefined;

  return (
    <div className="min-h-screen bg-lima-950 text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-lima-950/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-lima-400 flex items-center justify-center text-lima-950">
              <Recycle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-extrabold text-white leading-tight">RecycleConnect</p>
              <p className="text-[10px] font-bold text-emerald-400 tracking-[0.18em] uppercase">
                Myanmar
              </p>
            </div>
          </Link>

          {user ? (
            <Link to={appPath}>
              <Button size="sm" className="bg-lima-400 hover:bg-lima-300 text-lima-950 font-bold">
                Open app
              </Button>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" state={authState}>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent text-white border-white/25 hover:bg-white/10 gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </Button>
              </Link>
              <Link to="/register" state={authState}>
                <Button size="sm" className="bg-lima-400 hover:bg-lima-300 text-lima-950 font-bold gap-1.5">
                  <UserPlus className="w-3.5 h-3.5" />
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 space-y-16">
        <section className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-200 bg-emerald-500/15 border border-emerald-400/20 rounded-full px-3 py-1">
              Community recycling for Yangon, Mandalay & nationwide
            </p>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Turn household waste into points, pickups, and a cleaner Myanmar.
            </h1>
            <p className="text-emerald-100/80 text-base sm:text-lg leading-relaxed max-w-xl">
              Scan recyclables, request doorstep collection, and let verified recyclers handle the rest. Citizens earn Green Points. Recyclers manage pickups. Admins keep the network running.
            </p>

            {user ? (
              <Link to={appPath}>
                <Button size="lg" className="bg-lima-400 hover:bg-lima-300 text-lima-950 font-bold gap-2">
                  Continue as {user.name}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <div className="flex flex-wrap gap-3">
                <Link to="/register" state={authState}>
                  <Button size="lg" className="bg-lima-400 hover:bg-lima-300 text-lima-950 font-bold gap-2">
                    <UserPlus className="w-5 h-5" />
                    Register
                  </Button>
                </Link>
                <Link to="/login" state={authState}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 text-white border-white/20 hover:bg-white/20 gap-2"
                  >
                    <LogIn className="w-5 h-5" />
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: ScanLine, title: "Scan items", text: "Identify recyclable materials with the AI scanner." },
              { icon: MapPin, title: "Find centers", text: "Locate nearby recycling centers and drop-off hubs." },
              { icon: Truck, title: "Request pickup", text: "Schedule collection and track status from pending to done." },
              { icon: Coins, title: "Earn points", text: "Get Green Points when a recycler completes your request." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2"
              >
                <item.icon className="w-5 h-5 text-lima-400" />
                <h2 className="font-bold">{item.title}</h2>
                <p className="text-sm text-emerald-100/70">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-extrabold">Choose how you join</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white text-slate-900 p-6 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Citizen</p>
              <h3 className="text-lg font-extrabold">USER</h3>
              <p className="text-sm text-slate-600">Scan waste, view centers, create collection requests, and earn points.</p>
            </div>
            <div className="rounded-2xl bg-white text-slate-900 p-6 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Collector</p>
              <h3 className="text-lg font-extrabold">RECYCLER</h3>
              <p className="text-sm text-slate-600">View pickup requests, accept or reject them, and update collection status.</p>
            </div>
            <div className="rounded-2xl bg-white text-slate-900 p-6 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Platform</p>
              <h3 className="text-lg font-extrabold">ADMIN</h3>
              <p className="text-sm text-slate-600">Manage recycling centers and user accounts across the network.</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-lima-400 text-lima-950 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold">Ready to start recycling?</h2>
            <p className="text-sm font-medium text-lima-800 max-w-xl">
              Create a free account or sign in to scan items, request pickups, or manage collections.
            </p>
            <p className="flex items-center gap-1.5 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Verified collectors across Myanmar
            </p>
          </div>
          {user ? (
            <Link to={appPath}>
              <Button size="lg" className="bg-lima-950 hover:bg-lima-900 text-white font-bold">
                Open app
              </Button>
            </Link>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Link to="/register" state={authState}>
                <Button size="lg" className="bg-lima-950 hover:bg-lima-900 text-white font-bold gap-2">
                  <UserPlus className="w-4 h-4" />
                  Register
                </Button>
              </Link>
              <Link to="/login" state={authState}>
                <Button size="lg" variant="outline" className="border-lima-950/20 text-lima-950 bg-white/40 hover:bg-white gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
