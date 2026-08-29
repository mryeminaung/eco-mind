import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AuthUser, UserRole } from "@/types";
import { api, setAuthToken, getAuthToken } from "@/shared/api";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signingOut: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (data: { name: string; email: string; password: string; role?: UserRole }) => Promise<AuthUser>;
  logout: () => void;
  finishSignOut: () => void;
  hasRole: (...roles: UserRole[]) => boolean;
  updateProfile: (data: { name?: string; email?: string; currentPassword?: string }) => Promise<AuthUser>;
  changePassword: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .getMe()
      .then(setUser)
      .catch(() => {
        setAuthToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    setAuthToken(data.token);
    setSigningOut(false);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload: { name: string; email: string; password: string; role?: UserRole }) => {
    const data = await api.register(payload);
    setAuthToken(data.token);
    setSigningOut(false);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    setSigningOut(true);
    setAuthToken(null);
    setUser(null);
  };

  const finishSignOut = () => {
    setSigningOut(false);
  };

  const updateProfile = async (payload: { name?: string; email?: string; currentPassword?: string }) => {
    const data = await api.updateProfile(payload);
    if (data.token) setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const changePassword = async (payload: { currentPassword: string; newPassword: string }) => {
    await api.changePassword(payload);
  };

  const hasRole = (...roles: UserRole[]) => Boolean(user && roles.includes(user.role));

  const value = useMemo(
    () => ({
      user,
      loading,
      signingOut,
      login,
      register,
      logout,
      finishSignOut,
      hasRole,
      updateProfile,
      changePassword,
    }),
    [user, loading, signingOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

export function roleHomePath(role?: UserRole) {
  if (role === "RECYCLER") return "/collector";
  if (role === "ADMIN") return "/overview";
  if (role === "USER") return "/dashboard";
  return "/";
}
