import { Route, Routes, Navigate } from "react-router-dom";
import { HomePage } from "./pages/home";
import { LoginPage, SignupPage } from "./pages/auth";
import { Dashboard, IMEIScanner } from "./pages/admin";
import { PublicRoute } from "./components";
import { useAuthVerify } from "./hooks";

function App() {
  // Verify auth on app load
  useAuthVerify();

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />

        {/* Auth Routes - Redirect if already logged in */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes - Require Admin Role */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/imei-scanner" element={<IMEIScanner />} />

        {/* 404 - Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
