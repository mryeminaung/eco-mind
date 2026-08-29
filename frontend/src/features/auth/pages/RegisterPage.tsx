import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Coins, ScanLine, Truck, UserPlus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { AuthSplitLayout } from "@/features/auth/AuthSplitLayout";
import { UserRole } from "@/types";
import { roleHomePath, useAuth } from "@/features/auth/AuthContext";
import { useLocale } from "@/i18n/LocaleContext";

export const RegisterPage: React.FC = () => {
  const { user, register } = useAuth();
  const { t } = useLocale();
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
    return <Navigate to={from || roleHomePath(user.role)} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const created = await register({ name: name.trim(), email: email.trim(), password, role });
      navigate(from || roleHomePath(created.role), { replace: true });
    } catch (err: any) {
      setError(err.message || t("auth.failedRegister"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      eyebrow={t("auth.getStarted")}
      title={t("auth.registerTitle")}
      description={t("auth.registerDesc")}
      points={[
        { icon: ScanLine, text: t("auth.point.photo") },
        { icon: Truck, text: t("auth.point.book") },
        { icon: Coins, text: t("auth.point.points") },
      ]}
    >
      <h2 className="text-2xl font-extrabold text-slate-900">{t("auth.createHeading")}</h2>
      <p className="text-sm text-slate-500 mt-1 mb-7">
        {t("auth.createSub")}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1.5 block">{t("auth.fullName")}</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("auth.namePlaceholder")} required />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1.5 block">{t("auth.email")}</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("auth.emailPlaceholder")}
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1.5 block">{t("auth.password")}</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.passwordHint")}
            minLength={6}
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 mb-1.5 block">{t("auth.iAmA")}</label>
          <Select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
            <option value="USER">{t("auth.role.user")}</option>
            <option value="RECYCLER">{t("auth.role.recycler")}</option>
          </Select>
        </div>

        {error && (
          <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full h-11 gap-2 font-semibold" disabled={loading}>
          <UserPlus className="w-4 h-4" />
          {loading ? t("auth.creating") : t("auth.createHeading")}
        </Button>
      </form>

      <p className="text-sm text-slate-600 mt-7">
        {t("auth.haveAccount")}{" "}
        <Link to="/login" state={from ? { from } : undefined} className="font-semibold text-emerald-700 hover:underline">
          {t("auth.signInLink")}
        </Link>
      </p>
      <p className="text-xs text-slate-400 mt-3">
        <Link to="/" className="hover:text-emerald-700">
          {t("auth.backLanding")}
        </Link>
      </p>
    </AuthSplitLayout>
  );
};
