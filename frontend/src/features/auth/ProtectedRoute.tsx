import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserRole } from "@/types";
import { useAuth } from "./AuthContext";

interface Props {
  children: React.ReactNode;
  roles?: UserRole[];
}

export const ProtectedRoute: React.FC<Props> = ({ children, roles }) => {
  const { user, loading, signingOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-700" />
      </div>
    );
  }

  if (signingOut) {
    return null;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
