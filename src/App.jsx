import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import UserManagementPage from './pages/UserManagementPage';
import ListingManagementPage from './pages/ListingManagementPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import AdminLayout from './components/Layout/AdminLayout'; // Import AdminLayout
import AccountDeletionPolicyPage from './pages/AccountDeletionPolicyPage'; // Import the new page

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/account-deletion-policy" element={<AccountDeletionPolicyPage />} />

      {/* Admin Routes: Wrapped by ProtectedRoute and AdminLayout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Default admin page (dashboard) */}
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="listings" element={<ListingManagementPage />} />
        <Route path="categories" element={<CategoryManagementPage />} />
      </Route>

      {/* Redirect root to /login if not authenticated, or /admin if authenticated.
          For simplicity now, always redirecting to /login if no other match,
          or let ProtectedRoute handle /admin access.
          A common pattern is to redirect / to /admin if logged in, else to /login.
          Let's redirect / to /admin, ProtectedRoute will then kick to /login if needed.
      */}
      <Route path="/" element={<Navigate to="/admin" replace />} />

      {/* Catch-all for 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
