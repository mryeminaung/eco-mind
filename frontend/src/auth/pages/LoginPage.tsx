import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { BrandLogo } from "@/shared/components/BrandLogo";
import { roleHomePath, useAuth } from "@/auth/AuthContext";

const DEMO_ACCOUNTS = [
  { label: "Citizen", email: "citizen@ecomind.mm", role: "USER" },
  { label: "Recycler", email: "recycler@ecomind.mm", role: "RECYCLER" },
  { label: "Admin", email: "admin@ecomind.mm", role: "ADMIN" },
];

export const LoginPage: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  const [email, setEmail] = useState("citizen@ecomind.mm");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to={from || roleHomePath(user.role)} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const loggedIn = await login(email.trim(), password);
      navigate(from || roleHomePath(loggedIn.role), { replace: true });
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-lima-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center mb-8">
          <BrandLogo size="lg" className="rounded-xl" />
        </Link>

        <div className="rounded-3xl bg-white p-7 shadow-xl">
          <h1 className="text-2xl font-extrabold text-slate-900">Sign in</h1>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Use your EcoMind account to scan, request pickups, or manage collections.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              <LogIn className="w-4 h-4" />
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Demo accounts (password: password123)
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => {
                    setEmail(account.email);
                    setPassword("password123");
                  }}
                  className="text-[11px] font-semibold px-2 py-2 rounded-xl border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 text-slate-700"
                >
                  {account.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-600 mt-6 text-center">
            New to EcoMind?{" "}
            <Link to="/register" state={from ? { from } : undefined} className="font-semibold text-emerald-700 hover:underline">
              Create an account
            </Link>
          </p>
          <p className="text-xs text-slate-400 mt-3 text-center">
            <Link to="/" className="hover:text-emerald-700">
              Back to landing
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
