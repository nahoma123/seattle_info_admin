import React, { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';

// No more inline styles object here; we'll use classes from index.css

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, page_size: 10, total_records: 0, total_pages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [filterEmail, setFilterEmail] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const [fetchParams, setFetchParams] = useState({ page: 1, page_size: 10 });

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const currentParams = { ...fetchParams };
      if (filterEmail.trim()) currentParams.email = filterEmail.trim();
      if (filterName.trim()) currentParams.name = filterName.trim();
      if (filterRole) currentParams.role = filterRole;

      const response = await userService.getUsers(currentParams);
      setUsers(response.data || []);
      setPagination(response.pagination || { current_page: 1, page_size: 10, total_records: 0, total_pages: 1 });
    } catch (err) {
      setError(err.message || 'Failed to fetch users.');
      setUsers([]);
      setPagination({ current_page: 1, page_size: 10, total_records: 0, total_pages: 1 });
    } finally {
      setIsLoading(false);
    }
  }, [fetchParams, filterEmail, filterName, filterRole]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setFetchParams(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFetchParams(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="container mt-3"> {/* Use .container for padding and max-width */}
      <h2 className="mb-3">User Management</h2> {/* Use global heading style */}

      <div className="card mb-3">
        <div className="card-body">
          <form onSubmit={handleFilterSubmit} className="d-flex flex-wrap gap-3 align-items-end"> {/* Use flex for layout */}
            <div className="form-group"> {/* Use .form-group for spacing */}
              <label htmlFor="filterEmail" className="form-label">Filter by Email:</label>
              <input
                type="text"
                id="filterEmail"
                className="form-control"
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
                placeholder="e.g., user@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="filterName" className="form-label">Filter by Name:</label>
              <input
                type="text"
                id="filterName"
                className="form-control"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="e.g., John Doe"
              />
            </div>
            <div className="form-group">
              <label htmlFor="filterRole" className="form-label">Filter by Role:</label>
              <select
                id="filterRole"
                className="form-control"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group"> {/* Aligns button with other form groups */}
                 <button type="submit" className="btn btn-primary" disabled={isLoading}>Apply Filters</button>
            </div>
          </form>
        </div>
      </div>

      {isLoading && <div className="text-center mt-3"><div className="spinner"></div> <p>Loading users...</p></div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {!isLoading && !error && users.length === 0 && <div className="alert alert-info mt-3">No users found matching your criteria.</div>}

      {!isLoading && !error && users.length > 0 && (
        <>
          <div className="table-responsive"> {/* Added for better behavior on small screens */}
            <table className="table table-hover mt-3"> {/* Use .table and .table-hover */}
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Role</th>
                  <th>Email Verified</th>
                  <th>Created At</th>
                  <th>Last Login</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.role}</td>
                    <td>{user.is_email_verified ? 'Yes' : 'No'}</td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>{user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination-controls mt-3 d-flex justify-content-between align-items-center"> {/* Flex for layout */}
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1 || isLoading}
              className="btn btn-secondary"
            >
              Previous
            </button>
            <span>
              Page {pagination.current_page} of {pagination.total_pages} (Total Users: {pagination.total_records})
            </span>
            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page >= pagination.total_pages || isLoading}
              className="btn btn-secondary"
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
