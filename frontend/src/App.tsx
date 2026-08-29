import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/features/auth/AuthContext";
import { LocaleProvider } from "@/i18n/LocaleContext";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { DashboardLayout } from "@/layout/components/DashboardLayout";
import { HomePage } from "@/features/pickups/pages/HomePage";
import { ServicesDirectoryPage } from "@/features/services/pages/ServicesDirectoryPage";
import { DropOffHubsPage } from "@/features/hubs/pages/DropOffHubsPage";
import { CitizenDashboardPage } from "@/features/dashboard/pages/CitizenDashboardPage";
import { GreenRewardsPage } from "@/features/dashboard/pages/GreenRewardsPage";
import { CommunityImpactPage } from "@/features/community/pages/CommunityImpactPage";
import { AiScannerPage } from "@/features/scanner/pages/AiScannerPage";
import { RecyclingCentersPage } from "@/features/centers/pages/RecyclingCentersPage";
import { RecyclingCenterDetailPage } from "@/features/centers/pages/RecyclingCenterDetailPage";
import { CreateRequestPage } from "@/features/pickups/pages/CreateRequestPage";
import { RecyclerRequestsPage } from "@/features/collector/pages/RecyclerRequestsPage";
import { ManageUsersPage } from "@/features/admin/pages/ManageUsersPage";
import { LandingPage } from "@/features/landing/LandingPage";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";

export default function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/community" element={<CommunityImpactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<DashboardLayout />}>
            <Route
              path="/overview"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scan"
              element={
                <ProtectedRoute roles={["USER", "ADMIN"]}>
                  <AiScannerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/centers"
              element={
                <ProtectedRoute roles={["USER", "RECYCLER", "ADMIN"]}>
                  <RecyclingCentersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/centers/:id"
              element={
                <ProtectedRoute roles={["USER", "RECYCLER", "ADMIN"]}>
                  <RecyclingCenterDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recycling-centers"
              element={
                <ProtectedRoute roles={["USER", "RECYCLER", "ADMIN"]}>
                  <RecyclingCentersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recycling-centers/:id"
              element={
                <ProtectedRoute roles={["USER", "RECYCLER", "ADMIN"]}>
                  <RecyclingCenterDetailPage />
                </ProtectedRoute>
              }
            />
            <Route path="/services" element={<ServicesDirectoryPage />} />
            <Route path="/hubs" element={<DropOffHubsPage />} />
            <Route
              path="/request-pickup"
              element={
                <ProtectedRoute roles={["USER", "ADMIN"]}>
                  <CreateRequestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <ProtectedRoute roles={["USER", "ADMIN"]}>
                  <CreateRequestPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/collector"
              element={
                <ProtectedRoute roles={["RECYCLER", "ADMIN"]}>
                  <RecyclerRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recycler-dashboard"
              element={
                <ProtectedRoute roles={["RECYCLER", "ADMIN"]}>
                  <RecyclerRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute roles={["USER"]}>
                  <CitizenDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rewards"
              element={
                <ProtectedRoute roles={["USER"]}>
                  <GreenRewardsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute roles={["ADMIN"]}>
                  <ManageUsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute roles={["USER", "RECYCLER", "ADMIN"]}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LocaleProvider>
  );
}
