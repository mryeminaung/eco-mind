import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { BrandLogo } from "@/shared/components/BrandLogo";
import { UserRole } from "@/types";
import { roleHomePath, useAuth } from "@/auth/AuthContext";

export const RegisterPage: React.FC = () => {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("USER");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to={roleHomePath(user.role)} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const created = await register({ name: name.trim(), email: email.trim(), password, role });
      navigate(roleHomePath(created.role), { replace: true });
    } catch (err: any) {
      setError(err.message || "Failed to create account");
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
          <h1 className="text-2xl font-extrabold text-slate-900">Create account</h1>
          <p className="text-sm text-slate-500 mt-1 mb-6">
            Join as a citizen to earn points, or as a recycler to accept pickups.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">Full name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="May Thiri" required />
            </div>
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
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">I am a</label>
              <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
                <option value="USER">Citizen (User)</option>
                <option value="RECYCLER">Recycler / Collector</option>
              </Select>
            </div>

            {error && (
              <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full gap-2" disabled={loading}>
              <UserPlus className="w-4 h-4" />
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-sm text-slate-600 mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" state={from ? { from } : undefined} className="font-semibold text-emerald-700 hover:underline">
              Sign in
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
