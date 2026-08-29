import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { LoginPage } from "./auth/pages/LoginPage";
import { RegisterPage } from "./auth/pages/RegisterPage";
import { DashboardLayout } from "./layout/components/DashboardLayout";
import { HomePage } from "./pickups/pages/HomePage";
import { ServicesDirectoryPage } from "./services/pages/ServicesDirectoryPage";
import { DropOffHubsPage } from "./hubs/pages/DropOffHubsPage";
import { CitizenDashboardPage } from "./dashboard/pages/CitizenDashboardPage";
import { CommunityImpactPage } from "./community/pages/CommunityImpactPage";
import { AiScannerPage } from "./scanner/pages/AiScannerPage";
import { RecyclingCentersPage } from "./centers/pages/RecyclingCentersPage";
import { CreateRequestPage } from "./pickups/pages/CreateRequestPage";
import { RecyclerRequestsPage } from "./collector/pages/RecyclerRequestsPage";
import { ManageUsersPage } from "./admin/pages/ManageUsersPage";
import { LandingPage } from "./landing/LandingPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/overview" element={<HomePage />} />
            <Route
              path="/scan"
              element={
                <ProtectedRoute roles={["USER", "ADMIN"]}>
                  <AiScannerPage />
                </ProtectedRoute>
              }
            />
            <Route path="/centers" element={<RecyclingCentersPage />} />
            <Route path="/recycling-centers" element={<RecyclingCentersPage />} />
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
                <ProtectedRoute roles={["USER", "ADMIN"]}>
                  <CitizenDashboardPage />
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
            <Route path="/community" element={<CommunityImpactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
