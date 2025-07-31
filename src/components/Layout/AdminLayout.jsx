import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom'; // Use NavLink for active styling
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css'; // Import the CSS file

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      // Handle logout error if needed, e.g., show a notification
      console.error("Logout failed:", error);
      // Still navigate to login page as a fallback
      navigate('/login');
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-layout__sidebar">
        <div className="admin-layout__sidebar-header">
          <h1 className="admin-layout__sidebar-title">Admin</h1>
        </div>
        <nav className="admin-layout__nav">
          <NavLink
            to="/admin"
            end // Important for NavLink to match exactly for dashboard/index route
            className={({ isActive }) => isActive ? "admin-layout__nav-link active" : "admin-layout__nav-link"}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => isActive ? "admin-layout__nav-link active" : "admin-layout__nav-link"}
          >
            User Management
          </NavLink>
          <NavLink
            to="/admin/listings"
            className={({ isActive }) => isActive ? "admin-layout__nav-link active" : "admin-layout__nav-link"}
          >
            Listing Management
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) => isActive ? "admin-layout__nav-link active" : "admin-layout__nav-link"}
          >
            Category Management
          </NavLink>
        </nav>
      </aside>
      <div className="admin-layout__content-wrapper">
        <header className="admin-layout__header">
          <div className="admin-layout__user-info">
            Welcome, {user?.email || user?.displayName || user?.name || 'Admin'}!
          </div>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </header>
        <main className="admin-layout__main-content">
          <Outlet /> {/* Nested admin pages will render here */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
