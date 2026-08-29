import React, { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Coins, LogIn, ScanLine, Truck } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { AuthSplitLayout } from "@/features/auth/AuthSplitLayout";
import { roleHomePath, useAuth } from "@/features/auth/AuthContext";
import { useLocale } from "@/i18n/LocaleContext";

const DEMO_ACCOUNTS = [
  { labelKey: "auth.demo.citizen", email: "citizen@ecomind.mm" },
  { labelKey: "auth.demo.recycler", email: "recycler@ecomind.mm" },
  { labelKey: "auth.demo.admin", email: "admin@ecomind.mm" },
];

export const LoginPage: React.FC = () => {
  const { user, login } = useAuth();
  const { t } = useLocale();
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
      setError(err.message || t("auth.failedLogin"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      eyebrow={t("auth.welcomeBack")}
      title={t("auth.signInTitle")}
      description={t("auth.signInDesc")}
      points={[
        { icon: ScanLine, text: t("auth.point.scan") },
        { icon: Truck, text: t("auth.point.track") },
        { icon: Coins, text: t("auth.point.earn") },
      ]}
    >
      <h2 className="text-2xl font-extrabold text-slate-900">{t("auth.signIn")}</h2>
      <p className="text-sm text-slate-500 mt-1 mb-7">
        {t("auth.continueAccount")}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            placeholder={t("auth.passwordPlaceholder")}
            required
          />
        </div>

        {error && (
          <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" className="w-full h-11 gap-2 font-semibold" disabled={loading}>
          <LogIn className="w-4 h-4" />
          {loading ? t("auth.signingIn") : t("auth.signIn")}
        </Button>
      </form>

      <div className="mt-6">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          {t("auth.demoAccounts")}
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
              className="text-[11px] font-semibold px-2 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-200 text-slate-700"
            >
              {t(account.labelKey)}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-slate-600 mt-7">
        {t("auth.newTo")}{" "}
        <Link to="/register" state={from ? { from } : undefined} className="font-semibold text-emerald-700 hover:underline">
          {t("auth.createAccount")}
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
