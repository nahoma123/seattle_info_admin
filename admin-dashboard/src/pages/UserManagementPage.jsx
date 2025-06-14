import React, { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService'; // userService is updated

const styles = {
  container: { padding: '20px' },
  title: { marginBottom: '20px' },
  filterSection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px'
  },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontWeight: 'bold', fontSize: '0.9em' },
  input: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '200px' },
  select: { padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '200px' },
  button: { padding: '8px 15px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', alignSelf: 'flex-end' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  th: { border: '1px solid #ddd', padding: '10px', background: '#f4f4f4', textAlign: 'left' },
  td: { border: '1px solid #ddd', padding: '10px', textAlign: 'left' },
  error: { color: 'red', marginTop: '10px'},
  loading: { marginTop: '10px'},
  paginationControls: { marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  noResults: { marginTop: '10px' }
};

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, page_size: 10, total_records: 0, total_pages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Filters
  const [filterEmail, setFilterEmail] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState(''); // Default to 'all roles'

  // State to trigger fetch (e.g., after applying filters)
  const [fetchParams, setFetchParams] = useState({ page: 1, page_size: 10 });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      // Construct params for the API call, including pagination and active filters
      const currentParams = { ...fetchParams };
      if (filterEmail) currentParams.email = filterEmail;
      if (filterName) currentParams.name = filterName;
      if (filterRole) currentParams.role = filterRole;

      const response = await userService.getUsers(currentParams); // userService.getUsers now returns { data, pagination }
      setUsers(response.data || []);
      setPagination(response.pagination || { current_page: 1, page_size: 10, total_records: 0, total_pages: 1 });
    } catch (err) {
      setError(err.message || 'Failed to fetch users.');
      setUsers([]);
      setPagination({ current_page: 1, page_size: 10, total_records: 0, total_pages: 1 });
    } finally {
      setIsLoading(false);
    }
  }, [fetchParams, filterEmail, filterName, filterRole]); // Dependencies for useCallback

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // fetchUsers is memoized with useCallback and its own dependencies

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setFetchParams(prev => ({ ...prev, page: 1 })); // Reset to page 1 when filters change
    // fetchUsers will be called by useEffect due to fetchParams change
  };

  const handlePageChange = (newPage) => {
    setFetchParams(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>User Management</h1>

      <form onSubmit={handleFilterSubmit} style={styles.filterSection}>
        <div style={styles.filterGroup}>
          <label htmlFor="filterEmail" style={styles.label}>Filter by Email:</label>
          <input
            type="text"
            id="filterEmail"
            style={styles.input}
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
            placeholder="e.g., user@example.com"
          />
        </div>
        <div style={styles.filterGroup}>
          <label htmlFor="filterName" style={styles.label}>Filter by Name:</label>
          <input
            type="text"
            id="filterName"
            style={styles.input}
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="e.g., John Doe"
          />
        </div>
        <div style={styles.filterGroup}>
          <label htmlFor="filterRole" style={styles.label}>Filter by Role:</label>
          <select
            id="filterRole"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            style={styles.select}
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" style={styles.button} disabled={isLoading}>Apply Filters</button>
      </form>

      {isLoading && <p style={styles.loading}>Loading users...</p>}
      {error && <p style={styles.error}>Error: {error}</p>}

      {!isLoading && !error && users.length === 0 && <p style={styles.noResults}>No users found matching your criteria.</p>}

      {!isLoading && !error && users.length > 0 && (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>First Name</th>
                <th style={styles.th}>Last Name</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Email Verified</th>
                <th style={styles.th}>Created At</th>
                <th style={styles.th}>Last Login</th>
                {/* Removed 'Actions' column as it's view-only */}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={styles.td}>{user.id}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>{user.first_name}</td>
                  <td style={styles.td}>{user.last_name}</td>
                  <td style={styles.td}>{user.role}</td>
                  <td style={styles.td}>{user.is_email_verified ? 'Yes' : 'No'}</td>
                  <td style={styles.td}>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td style={styles.td}>{user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={styles.paginationControls}>
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1 || isLoading}
              style={styles.button}
            >
              Previous
            </button>
            <span>
              Page {pagination.current_page} of {pagination.total_pages} (Total Users: {pagination.total_records})
            </span>
            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page >= pagination.total_pages || isLoading}
              style={styles.button}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagementPage;
