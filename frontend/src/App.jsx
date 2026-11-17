
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

import { fetchMe } from "./features/auth/authSlice";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import NewEstimatePage from "./pages/NewEstimatePage";
import RequestDetailPage from "./pages/RequestDetailPage";

import ContractorProfilePage from "./pages/ContractorProfilePage";
import ContractorPricingPage from "./pages/ContractorPricingPage";
import ContractorRequestsPage from "./pages/ContractorRequestsPage";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminContractorsPage from "./pages/admin/AdminContractorsPage";
import AdminRequestsPage from "./pages/admin/AdminRequestsPage";
import AdminQuotationsPage from "./pages/admin/AdminQuotationsPage";

import AdminLayout from "./layouts/AdminLayout";

function RoutesView() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <LandingPage />
          </>
        }
      />

      <Route
        path="/login"
        element={<AuthPage mode="login" />}
      />

      <Route
        path="/register"
        element={<AuthPage mode="register" />}
      />

      {/* HOMEOWNER ROUTES */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["homeowner"]}>
            <>
              <Navbar />
              <DashboardPage />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/new-estimate"
        element={
          <ProtectedRoute allowedRoles={["homeowner"]}>
            <>
              <Navbar />
              <NewEstimatePage />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/requests/:id"
        element={
          <ProtectedRoute allowedRoles={["homeowner"]}>
            <>
              <Navbar />
              <RequestDetailPage />
            </>
          </ProtectedRoute>
        }
      />

      {/* CONTRACTOR ROUTES */}
      <Route
        path="/contractor/profile"
        element={
          <ProtectedRoute allowedRoles={["contractor"]}>
            <>
              <Navbar />
              <ContractorProfilePage />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/contractor/pricing"
        element={
          <ProtectedRoute allowedRoles={["contractor"]}>
            <>
              <Navbar />
              <ContractorPricingPage />
            </>
          </ProtectedRoute>
        }
      />

      <Route
        path="/contractor/requests"
        element={
          <ProtectedRoute allowedRoles={["contractor"]}>
            <>
              <Navbar />
              <ContractorRequestsPage />
            </>
          </ProtectedRoute>
        }
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="contractors" element={<AdminContractorsPage />} />
        <Route path="requests" element={<AdminRequestsPage />} />
        <Route path="quotations" element={<AdminQuotationsPage />} />
      </Route>

      {/* FALLBACK */}
      <Route
        path="*"
        element={
          <div className="container py-5">
            Page not found
          </div>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <RoutesView />
    </BrowserRouter>
  );
}
