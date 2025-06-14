import React, { useState, useEffect, useCallback } from 'react';
import listingService from '../services/listingService';
import categoryService from '../services/categoryService'; // To fetch categories for filter
// No more inline styles object here; we'll use classes from index.css

const ListingManagementPage = () => {
  const [listings, setListings] = useState([]);
  const [allCategories, setAllCategories] = useState([]); // For category filter dropdown
  const [pagination, setPagination] = useState({ current_page: 1, page_size: 10, total_records: 0, total_pages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [error, setError] = useState('');

  // Filters
  const [filterStatus, setFilterStatus] = useState('pending_approval'); // Existing filter
  const [filterCategoryId, setFilterCategoryId] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  const [filterSearchTerm, setFilterSearchTerm] = useState('');

  const [rejectionReasons, setRejectionReasons] = useState({});

  const [fetchParams, setFetchParams] = useState({ page: 1, page_size: 10, status: 'pending_approval' });

  // Fetch categories for the filter dropdown
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        // Assuming getCategories fetches all categories without pagination for the filter,
        // or fetches first page of a reasonable number. Adjust if API needs specific params.
        const response = await categoryService.getCategories({ page_size: 200 }); // Fetch a good number for dropdown
        setAllCategories(response.data || []);
      } catch (catError) {
        console.error("Failed to load categories for filter:", catError);
        // Don't block listing display if categories fail, but log error.
        setError(prev => prev + "\nCould not load categories for filter.");
      } finally {
        setIsLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);


  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const currentParams = { ...fetchParams }; // Includes page, page_size
      // Apply active filters
      if (filterStatus) currentParams.status = filterStatus; else delete currentParams.status;
      if (filterCategoryId) currentParams.category_id = filterCategoryId; else delete currentParams.category_id;
      if (filterUserId.trim()) currentParams.user_id = filterUserId.trim(); else delete currentParams.user_id;
      if (filterSearchTerm.trim()) currentParams.search_term = filterSearchTerm.trim(); else delete currentParams.search_term;

      const responseData = await listingService.getListingsFiltered(currentParams);
      setListings(responseData.data || responseData || []);
      setPagination(responseData.pagination || { current_page: fetchParams.page, page_size: fetchParams.page_size, total_records: (responseData.data || responseData || []).length, total_pages: 1 });
    } catch (err) {
      setError(err.message || 'Failed to fetch listings.');
      setListings([]);
      setPagination({ current_page: fetchParams.page, page_size: fetchParams.page_size, total_records: 0, total_pages: 1 });
    } finally {
      setIsLoading(false);
    }
  }, [fetchParams, filterStatus, filterCategoryId, filterUserId, filterSearchTerm]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setFetchParams(prev => ({ ...prev, page: 1, status: filterStatus })); // Reset to page 1 and update status in fetchParams
     // Other filters (category, user, search) are directly used in fetchListings via their state vars
  };

  const handlePageChange = (newPage) => {
    setFetchParams(prev => ({ ...prev, page: newPage }));
  };

  const handleApprove = async (listingId) => {
    // ... (same as before, ensure setIsLoading and setError('') are at the start)
    setIsLoading(true); setError('');
    try {
      await listingService.approveListing(listingId);
      fetchListings();
    } catch (err) { setError(err.message || `Failed to approve listing ${listingId}.`); setIsLoading(false); }
  };

  const handleReject = async (listingId) => {
    // ... (same as before, ensure setIsLoading and setError('') are at the start)
    setIsLoading(true); setError('');
    const reason = rejectionReasons[listingId] || '';
    if (!reason.trim()) { setError('Rejection reason is required.'); setIsLoading(false); return; }
    try {
      await listingService.updateListingStatusAdmin(listingId, 'rejected', reason);
      setRejectionReasons(prev => ({ ...prev, [listingId]: '' }));
      fetchListings();
    } catch (err) { setError(err.message || `Failed to reject listing ${listingId}.`); setIsLoading(false); }
  };

  const handleAdminRemove = async (listingId) => {
    // ... (same as before, ensure setIsLoading and setError('') are at the start)
    setIsLoading(true); setError('');
    try {
      await listingService.updateListingStatusAdmin(listingId, 'admin_removed', '');
      fetchListings();
    } catch (err) { setError(err.message || `Failed to remove listing ${listingId}.`); setIsLoading(false); }
  };

  const handleReasonChange = (listingId, reason) => {
    setRejectionReasons(prev => ({ ...prev, [listingId]: reason }));
  };

  return (
    <div className="container mt-3">
      <h2 className="mb-3">Listing Management</h2>

      <div className="card mb-3">
        <div className="card-body">
          <form onSubmit={handleFilterSubmit} className="d-flex flex-wrap gap-3 align-items-end">
            <div className="form-group">
              <label htmlFor="filterStatus" className="form-label">Status:</label>
              <select id="filterStatus" className="form-control" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="active">Active</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
                <option value="admin_removed">Admin Removed</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="filterCategoryId" className="form-label">Category:</label>
              <select id="filterCategoryId" className="form-control" value={filterCategoryId} onChange={(e) => setFilterCategoryId(e.target.value)} disabled={isLoadingCategories}>
                <option value="">All Categories</option>
                {allCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="filterUserId" className="form-label">User ID:</label>
              <input type="text" id="filterUserId" className="form-control" value={filterUserId} onChange={(e) => setFilterUserId(e.target.value)} placeholder="Enter User ID" />
            </div>
            <div className="form-group">
              <label htmlFor="filterSearchTerm" className="form-label">Search Term:</label>
              <input type="text" id="filterSearchTerm" className="form-control" value={filterSearchTerm} onChange={(e) => setFilterSearchTerm(e.target.value)} placeholder="Search title/desc" />
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-primary" disabled={isLoading || isLoadingCategories}>Apply Filters</button>
            </div>
          </form>
        </div>
      </div>

      {isLoading && <div className="text-center mt-3"><div className="spinner"></div> <p>Loading listings...</p></div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {!isLoading && !error && listings.length === 0 && <div className="alert alert-info mt-3">No listings found matching your criteria.</div>}

      {!isLoading && !error && listings.length > 0 && (
        <>
          <div className="table-responsive">
            <table className="table table-hover mt-3">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Desc. (Excerpt)</th>
                  <th>Submitter ID</th>
                  <th>Category ID</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <td>{listing.id}</td>
                    <td>{listing.title}</td>
                    <td>{(listing.description || '').substring(0, 50)}{listing.description && listing.description.length > 50 ? '...' : ''}</td>
                    <td>{listing.submitter_id || listing.user_id || 'N/A'}</td>
                    <td>{listing.category_id || 'N/A'}</td>
                    <td>{listing.status}</td>
                    <td>{new Date(listing.creation_date || listing.created_at).toLocaleDateString()}</td>
                    <td style={{minWidth: '220px'}}> {/* Min width for action area */}
                      {listing.status === 'pending_approval' && (
                        <>
                          <button onClick={() => handleApprove(listing.id)} className="btn btn-success btn-sm mb-1" disabled={isLoading}>Approve</button>
                          <div className="mt-1">
                            <textarea className="form-control form-control-sm" placeholder="Rejection Reason (req.)" value={rejectionReasons[listing.id] || ''} onChange={(e) => handleReasonChange(listing.id, e.target.value)} disabled={isLoading}></textarea>
                            <button onClick={() => handleReject(listing.id)} className="btn btn-danger btn-sm mt-1" disabled={isLoading || !(rejectionReasons[listing.id] || '').trim()}>Reject</button>
                          </div>
                        </>
                      )}
                      {listing.status === 'active' && (
                         <button onClick={() => handleAdminRemove(listing.id)} className="btn btn-warning btn-sm" disabled={isLoading}>Remove (Admin)</button>
                      )}
                       {listing.status === 'rejected' && listing.rejection_reason && (
                        <small className="text-muted d-block mt-1">Reason: {listing.rejection_reason}</small>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination-controls mt-3 d-flex justify-content-between align-items-center">
            <button onClick={() => handlePageChange(pagination.current_page - 1)} disabled={pagination.current_page <= 1 || isLoading} className="btn btn-secondary">Previous</button>
            <span>Page {pagination.current_page} of {pagination.total_pages} (Total Listings: {pagination.total_records})</span>
            <button onClick={() => handlePageChange(pagination.current_page + 1)} disabled={pagination.current_page >= pagination.total_pages || isLoading} className="btn btn-secondary">Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ListingManagementPage;
