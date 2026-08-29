import React, { useEffect, useState } from "react";
import { KeyRound, Save, Settings, Shield, UserRound } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { useLocale } from "@/i18n/LocaleContext";
import { displayBadgeAward } from "@/shared/badgeAward";
import { PageSectionHeader } from "@/shared/components/PageSectionHeader";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { t } = useLocale();
  const roleLabel = user ? t(`menu.role.${user.role}`) : "";

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [profilePassword, setProfilePassword] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  if (!user) return null;

  const emailChanged = email.trim().toLowerCase() !== user.email.toLowerCase();

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess(null);
    setProfileSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        currentPassword: emailChanged ? profilePassword : undefined,
      });
      setProfilePassword("");
      setProfileSuccess(t("settings.saved"));
    } catch (err: any) {
      setProfileError(err.message || t("settings.saveFailed"));
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    if (newPassword !== confirmPassword) {
      setPasswordError(t("settings.passwordMismatch"));
      return;
    }
    setPasswordSaving(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSuccess(t("settings.passwordUpdated"));
    } catch (err: any) {
      setPasswordError(err.message || t("settings.passwordFailed"));
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageSectionHeader
        title={t("page.settings.title")}
        description={t("page.settings.description")}
        icon={Settings}
      />

      <Card className="border border-slate-200/80">
        <CardContent className="p-6 sm:p-7">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-900 font-black text-sm flex items-center justify-center">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">
                {roleLabel} • {user.points} pts
              </p>
              <span className="mt-1.5 inline-flex items-center rounded-full bg-lima-100 text-emerald-800 border border-lima-200 px-2.5 py-0.5 text-[11px] font-bold">
                {displayBadgeAward(user)}
              </span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("settings.role")}</p>
              <p className="font-semibold text-slate-800 mt-0.5">{roleLabel}</p>
            </div>
            <div className="rounded-xl bg-slate-50 border border-slate-100 px-3.5 py-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("settings.email")}</p>
              <p className="font-semibold text-slate-800 mt-0.5 truncate">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-200/80">
        <CardContent className="p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-5">
            <UserRound className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg font-extrabold text-slate-900">{t("settings.profile")}</h2>
          </div>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">{t("settings.name")}</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("settings.namePlaceholder")}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">{t("settings.email")}</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("settings.emailPlaceholder")}
                required
              />
            </div>
            {emailChanged && (
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  {t("settings.currentPassword")}
                </label>
                <Input
                  type="password"
                  value={profilePassword}
                  onChange={(e) => setProfilePassword(e.target.value)}
                  placeholder={t("settings.emailPasswordHint")}
                  required
                />
              </div>
            )}

            {profileError && (
              <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {profileError}
              </p>
            )}
            {profileSuccess && (
              <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                {profileSuccess}
              </p>
            )}

            <Button type="submit" variant="eco" className="gap-2" disabled={profileSaving}>
              <Save className="w-4 h-4" />
              {profileSaving ? t("common.saving") : t("settings.saveProfile")}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border border-slate-200/80">
        <CardContent className="p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-5">
            <KeyRound className="w-5 h-5 text-emerald-700" />
            <h2 className="text-lg font-extrabold text-slate-900">{t("settings.password")}</h2>
          </div>
          <form onSubmit={handlePasswordSave} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                {t("settings.currentPassword")}
              </label>
              <Input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t("settings.currentPassword")}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                {t("settings.newPassword")}
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("settings.minPassword")}
                minLength={6}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                {t("settings.confirmPassword")}
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("settings.repeatPassword")}
                minLength={6}
                required
              />
            </div>

            {passwordError && (
              <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                {passwordError}
              </p>
            )}
            {passwordSuccess && (
              <p className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                {passwordSuccess}
              </p>
            )}

            <Button type="submit" variant="eco" className="gap-2" disabled={passwordSaving}>
              <Shield className="w-4 h-4" />
              {passwordSaving ? t("common.updating") : t("settings.updatePassword")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
