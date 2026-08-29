import React, { useEffect, useState } from "react";
import { RefreshCw, Trash2, Users } from "lucide-react";
import { AuthUser, UserRole } from "@/types";
import { api } from "@/shared/api";
import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Select } from "@/shared/ui/select";
import { PageSectionHeader } from "@/shared/components/PageSectionHeader";
import { Shield } from "lucide-react";
import { useLocale } from "@/i18n/LocaleContext";

const ROLE_STYLES: Record<UserRole, string> = {
  USER: "bg-emerald-50 text-emerald-800 border-emerald-200",
  RECYCLER: "bg-blue-50 text-blue-800 border-blue-200",
  ADMIN: "bg-amber-50 text-amber-800 border-amber-200",
};

export const ManageUsersPage: React.FC = () => {
  const { t } = useLocale();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadUsers = async () => {
    setError(null);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || t("users.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (id: string, role: UserRole) => {
    setBusyId(id);
    try {
      const updated = await api.updateUser(id, { role });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    } catch (err: any) {
      setError(err.message || t("users.roleFailed"));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("users.deleteConfirm"))) return;
    setBusyId(id);
    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      setError(err.message || t("users.deleteFailed"));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageSectionHeader
        title={t("page.users.title")}
        description={t("page.users.description")}
        icon={Shield}
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={loadUsers}
            className="gap-1.5 bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t("common.refresh")}
          </Button>
        }
      />

      {error && (
        <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-8 text-sm text-slate-500">{t("users.loading")}</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-sm text-slate-500 flex items-center gap-2">
              <Users className="w-4 h-4" />
              {t("users.empty")}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">{t("users.name")}</th>
                  <th className="px-4 py-3 font-semibold">{t("users.email")}</th>
                  <th className="px-4 py-3 font-semibold">{t("users.role")}</th>
                  <th className="px-4 py-3 font-semibold">{t("users.points")}</th>
                  <th className="px-4 py-3 font-semibold text-right">{t("users.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelf = user.id === currentUser?.id;
                  return (
                    <tr key={user.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-900">{user.name}</td>
                      <td className="px-4 py-3 text-slate-600">{user.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${ROLE_STYLES[user.role]}`}>
                            {user.role}
                          </span>
                          <Select
                            value={user.role}
                            disabled={isSelf || busyId === user.id}
                            onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                            className="h-9 w-36"
                          >
                            <option value="USER">USER</option>
                            <option value="RECYCLER">RECYCLER</option>
                            <option value="ADMIN">ADMIN</option>
                          </Select>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-emerald-800">{user.points}</td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isSelf || busyId === user.id}
                          onClick={() => handleDelete(user.id)}
                          className="gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          {t("users.delete")}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
