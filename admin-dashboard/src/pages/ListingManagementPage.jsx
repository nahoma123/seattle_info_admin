import React, { useState, useEffect, useCallback } from 'react';
import listingService from '../services/listingService'; // Import the listingService
import { useLocation } from 'react-router-dom'; // To read query params for filtering

// Basic inline styles (consider moving to a CSS file for larger applications)
const styles = {
  container: { padding: '20px' },
  title: { marginBottom: '20px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '20px' },
  th: { border: '1px solid #ddd', padding: '10px', background: '#f4f4f4', textAlign: 'left' },
  td: { border: '1px solid #ddd', padding: '10px', textAlign: 'left', verticalAlign: 'top' },
  button: { marginRight: '10px', padding: '5px 10px', cursor: 'pointer', marginBottom: '5px' },
  actionCell: { minWidth: '200px' }, // Enough space for buttons and reason input
  error: { color: 'red', marginTop: '10px'},
  loading: { marginTop: '10px'},
  filterSection: { marginBottom: '20px'},
  select: { padding: '8px', marginRight: '10px', border: '1px solid #ccc', borderRadius: '4px'},
  textarea: { width: '100%', minHeight: '40px', padding: '5px', border: '1px solid #ccc', borderRadius: '4px', marginTop: '5px' }
};

const ListingManagementPage = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();
  const [statusFilter, setStatusFilter] = useState('pending_approval'); // Default filter
  const [rejectionReasons, setRejectionReasons] = useState({}); // { listingId: reason }

  // Determine initial filter from URL query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get('status');
    if (status) {
      setStatusFilter(status);
    }
  }, [location.search]);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = {};
      if (statusFilter) {
        params.status = statusFilter;
      }
      const data = await listingService.getAdminListings(params);
      setListings(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch listings.');
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleUpdateStatus = async (listingId, newStatus) => {
    setIsLoading(true); // Consider a row-specific loading indicator later
    let reason = '';
    if (newStatus === 'rejected') {
      reason = rejectionReasons[listingId] || ''; // Get reason from state
      if (!reason) {
        // Basic validation, could be more robust
        alert('Rejection reason is required when rejecting a listing.');
        setIsLoading(false);
        return;
      }
    }

    try {
      await listingService.updateListingStatus(listingId, newStatus, reason);
      setRejectionReasons(prev => ({ ...prev, [listingId]: '' })); // Clear reason after successful reject
      fetchListings(); // Refresh list
    } catch (err) {
      setError(err.message || `Failed to update status for listing ${listingId}.`);
      setIsLoading(false); // Only reset general loading if fetchListings doesn't run or also fails
    }
    // setIsLoading(false) will be called in fetchListings' finally block
  };

  const handleReasonChange = (listingId, reason) => {
    setRejectionReasons(prev => ({ ...prev, [listingId]: reason }));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Listing Management</h1>

      <div style={styles.filterSection}>
        <label htmlFor="statusFilter">Filter by status: </label>
        <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.select}
        >
          <option value="">All Listings</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="active">Active</option>
          <option value="rejected">Rejected</option>
          <option value="expired">Expired</option>
          <option value="admin_removed">Admin Removed</option>
        </select>
      </div>

      {isLoading && <p style={styles.loading}>Loading listings...</p>}
      {error && <p style={styles.error}>Error: {error}</p>}

      {!isLoading && !error && listings.length === 0 && <p>No listings found for the selected filter.</p>}

      {!isLoading && !error && listings.length > 0 && (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Description (Excerpt)</th>
              <th style={styles.th}>Submitter ID</th>
              <th style={styles.th}>Category ID</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((listing) => (
              <tr key={listing.id}>
                <td style={styles.td}>{listing.id}</td>
                <td style={styles.td}>{listing.title}</td>
                <td style={styles.td}>
                  {(listing.description || '').substring(0, 50)}
                  {listing.description && listing.description.length > 50 ? '...' : ''}
                </td>
                <td style={styles.td}>{listing.submitter_id || listing.userId || 'N/A'}</td>
                <td style={styles.td}>{listing.category_id || 'N/A'}</td>
                <td style={styles.td}>{listing.status}</td>
                <td style={styles.td}>{new Date(listing.creation_date || listing.created_at).toLocaleDateString()}</td>
                <td style={styles.td} css={styles.actionCell}>
                  {listing.status === 'pending_approval' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(listing.id, 'active')}
                        style={{...styles.button, backgroundColor: 'green'}}
                        disabled={isLoading}
                      >
                        Approve
                      </button>
                      <div>
                        <textarea
                          style={styles.textarea}
                          placeholder="Rejection Reason (required)"
                          value={rejectionReasons[listing.id] || ''}
                          onChange={(e) => handleReasonChange(listing.id, e.target.value)}
                          disabled={isLoading}
                        />
                        <button
                          onClick={() => handleUpdateStatus(listing.id, 'rejected')}
                          style={{...styles.button, backgroundColor: 'red', marginTop: '5px'}}
                          disabled={isLoading || !rejectionReasons[listing.id]}
                        >
                          Reject
                        </button>
                      </div>
                    </>
                  )}
                  {/* For already active/other status listings, provide other actions */}
                  {listing.status === 'active' && (
                     <button
                        onClick={() => handleUpdateStatus(listing.id, 'admin_removed')}
                        style={{...styles.button, backgroundColor: 'orange'}}
                        disabled={isLoading}
                      >
                        Remove (Admin)
                      </button>
                  )}
                   {listing.status === 'rejected' && listing.rejection_reason && (
                    <p style={{fontSize: '0.9em', color: '#555'}}>Reason: {listing.rejection_reason}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListingManagementPage;
