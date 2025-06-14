import React, { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService'; // Import the userService
import { useLocation } from 'react-router-dom'; // To read query params for filtering

// Basic inline styles (consider moving to a CSS file for larger applications)
const styles = {
  container: { padding: '20px' },
  title: { marginBottom: '20px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  th: { border: '1px solid #ddd', padding: '10px', background: '#f4f4f4', textAlign: 'left' },
  td: { border: '1px solid #ddd', padding: '10px', textAlign: 'left' },
  button: { marginRight: '10px', padding: '5px 10px', cursor: 'pointer' },
  actionCell: { minWidth: '180px' }, // Ensure enough space for buttons
  error: { color: 'red', marginTop: '10px'},
  loading: { marginTop: '10px'},
  filterSection: { marginBottom: '20px'},
  select: { padding: '8px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '4px'},
};

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const location = useLocation(); // For reading query parameters
  const [statusFilter, setStatusFilter] = useState('');

  // Determine initial filter from URL query params (e.g., from Dashboard quick link)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');
    if (status) {
      setStatusFilter(status);
    } else {
      // Default to pending if no specific filter, or show all by setting to ''
      setStatusFilter('Pending Approval');
    }
  }, [location.search]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = {};
      if (statusFilter) {
        params.status = statusFilter;
      }
      const data = await userService.getUsers(params);
      setUsers(data || []); // Ensure data is an array
    } catch (err) {
      setError(err.message || 'Failed to fetch users.');
      setUsers([]); // Clear users on error
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]); // Dependency on statusFilter

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // fetchUsers is memoized with useCallback

  const handleApprove = async (userId) => {
    setIsLoading(true); // Or a specific loading state for the row
    try {
      await userService.approveUser(userId);
      // Refresh user list to show updated status
      fetchUsers();
    } catch (err) {
      setError(err.message || `Failed to approve user ${userId}.`);
      setIsLoading(false); // Reset general loading if it was set
    }
    // setIsLoading(false) will be called in fetchUsers' finally block
  };

  const handleReject = async (userId) => {
    setIsLoading(true); // Or a specific loading state for the row
    try {
      // Optional: Implement a confirmation dialog before rejecting
      await userService.rejectUser(userId);
      // Refresh user list (rejected user might be removed or status changed)
      fetchUsers();
    } catch (err) {
      setError(err.message || `Failed to reject user ${userId}.`);
      setIsLoading(false);
    }
  };

  // TODO: Implement role change functionality if needed
  // const handleChangeRole = async (userId, newRole) => { ... };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>User Management</h1>

      <div style={styles.filterSection}>
        <label htmlFor="statusFilter">Filter by status: </label>
        <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.select}
        >
          <option value="">All Users</option>
          <option value="Pending Approval">Pending Approval</option>
          <option value="Active">Active</option>
          {/* Add other statuses if relevant */}
        </select>
        {/* Button to manually apply filter if needed, but useEffect handles it on change */}
      </div>

      {isLoading && <p style={styles.loading}>Loading users...</p>}
      {error && <p style={styles.error}>Error: {error}</p>}

      {!isLoading && !error && users.length === 0 && <p>No users found for the selected filter.</p>}

      {!isLoading && !error && users.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User ID</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Registered</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={styles.td}>{user.id}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{`${user.first_name || ''} ${user.last_name || ''}`}</td>
                <td style={styles.td}>{user.role}</td>
                <td style={styles.td}>{user.status}</td>
                <td style={styles.td}>{new Date(user.registration_date || user.created_at).toLocaleDateString()}</td>
                <td style={styles.td} css={styles.actionCell}>
                  {user.status === 'Pending Approval' && (
                    <>
                      <button
                        onClick={() => handleApprove(user.id)}
                        style={{...styles.button, backgroundColor: 'green'}}
                        disabled={isLoading}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        style={{...styles.button, backgroundColor: 'red'}}
                        disabled={isLoading}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {/* Add Change Role button here if implementing */}
                  {/* <button onClick={() => handleChangeRole(user.id, 'newRole')} style={styles.button}>Change Role</button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagementPage;
