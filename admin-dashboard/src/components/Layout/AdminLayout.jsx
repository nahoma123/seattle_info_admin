import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Basic inline styles for layout
  const styles = {
    layout: { display: 'flex', minHeight: '100vh' },
    sidebar: { width: '250px', background: '#333', color: 'white', padding: '20px' },
    mainContent: { flexGrow: 1, padding: '20px', background: '#f4f4f4' },
    header: { background: '#fff', padding: '10px 20px', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    navLink: { display: 'block', color: 'white', padding: '10px 0', textDecoration: 'none' },
    userInfo: { fontSize: '0.9em'},
  };

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <h2>Admin Panel</h2>
        <nav>
          <Link to="/admin" style={styles.navLink}>Dashboard</Link>
          <Link to="/admin/users" style={styles.navLink}>User Management</Link>
          <Link to="/admin/listings" style={styles.navLink}>Listing Management</Link>
          <Link to="/admin/categories" style={styles.navLink}>Category Management</Link>
        </nav>
      </aside>
      <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        <header style={styles.header}>
          <div>Welcome, {user?.email || user?.name || 'Admin'}!</div>
          <button onClick={handleLogout} style={{padding: '8px 15px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px'}}>Logout</button>
        </header>
        <main style={styles.mainContent}>
          <Outlet /> {/* Nested admin pages will render here */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
