import React, { useEffect, useState } from "react";
import { RefreshCw, Shield, Trash2, Users } from "lucide-react";
import { AuthUser, UserRole } from "@/types";
import { api } from "@/shared/api";
import { useAuth } from "@/auth/AuthContext";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { Select } from "@/shared/ui/select";

const ROLE_STYLES: Record<UserRole, string> = {
  USER: "bg-emerald-50 text-emerald-800 border-emerald-200",
  RECYCLER: "bg-blue-50 text-blue-800 border-blue-200",
  ADMIN: "bg-amber-50 text-amber-800 border-amber-200",
};

export const ManageUsersPage: React.FC = () => {
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
      setError(err.message || "Failed to load users");
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
      setError(err.message || "Failed to update role");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    setBusyId(id);
    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <Badge variant="eco" className="text-xs mb-2">
            <Shield className="w-3.5 h-3.5 mr-1" />
            Admin
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage users
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Update roles and remove accounts across RecycleConnect Myanmar.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadUsers} className="gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
      </div>

      {error && (
        <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-8 text-sm text-slate-500">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="p-8 text-sm text-slate-500 flex items-center gap-2">
              <Users className="w-4 h-4" />
              No users found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Points</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
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
                          Delete
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
