import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { fetchProfile } from "./store/slices/authSlice";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/layout/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Desks from "./pages/Desks";
import MyBookings from "./pages/MyBookings";
import AdminDesks from "./pages/admin/AdminDesks";
import AdminBookings from "./pages/admin/AdminBookings";
import type { RootState } from "./store";

function App() {
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token) {
      dispatch(fetchProfile());
    }
  }, [token, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="desks" element={<Desks />} />
          <Route path="my-bookings" element={<MyBookings />} />

          <Route
            path="admin/desks"
            element={
              <ProtectedRoute adminOnly>
                <AdminDesks />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/bookings"
            element={
              <ProtectedRoute adminOnly>
                <AdminBookings />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
