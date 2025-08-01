import axios from 'axios';

// Base URL for general API calls (e.g., public listing search)
const VITE_BASE = import.meta.env.VITE_API_BASE_URL;
const API_V1_BASE_URL = VITE_BASE
  ? (VITE_BASE.endsWith('/api/v1') ? VITE_BASE : `${VITE_BASE}/api/v1`)
  : '/api/v1';
// Base URL for specific admin actions that might be namespaced under /admin if any other than listings admin actions
const ADMIN_API_BASE_URL = '/api/v1/admin'; // Keep for consistency if other admin calls use it, but listings admin actions are specific

const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

// Instance for calls to /api/v1 (like public listing search, but authenticated)
const createApiV1AuthorizedInstance = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_V1_BASE_URL, // Uses /api/v1
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

// Instance for calls specifically to /api/v1/listings/admin/* type paths
// This requires careful baseURL construction or full path usage.
// Given paths like /api/v1/listings/admin/:id/status,
// it's simpler to construct paths relative to /api/v1 or use full paths.
// Let's use createApiV1AuthorizedInstance and construct paths carefully.

/**
 * Fetches a list of listings. For admin, this might be the public search endpoint
 * filtered by status, if no dedicated admin listing search endpoint exists.
 * GIN Route: GET /api/v1/listings
 * @param {object} params - Query parameters for filtering (e.g., { status: 'pending_approval' })
 * @returns {Promise<Array>} A promise that resolves to an array of listing objects.
 */
export const getListingsFiltered = async (params) => {
  const apiClient = createApiV1AuthorizedInstance(); // Uses /api/v1 base
  try {
    const response = await apiClient.get('/listings', { params });
    // The component expects the full response object which should include
    // a 'data' property (the array of listings) and a 'pagination' property.
    return response.data;
  } catch (error) {
    console.error('Error fetching listings (filtered):', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Approves a specific listing.
 * GIN Route: POST /api/v1/listings/admin/:id/approve
 * @param {string} listingId - The ID of the listing to approve.
 * @returns {Promise<object>} A promise that resolves to the backend's response (e.g., updated listing or success message).
 */
export const approveListing = async (listingId) => {
  const apiClient = createApiV1AuthorizedInstance(); // Uses /api/v1 base
  try {
    // Path construction: /listings/admin/:id/approve
    const response = await apiClient.post(`/listings/admin/${listingId}/approve`);
    return response.data;
  } catch (error) {
    console.error(`Error approving listing ${listingId}:`, error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Updates the status of a specific listing (e.g., for rejection, admin removal).
 * GIN Route: PATCH /api/v1/listings/admin/:id/status
 * @param {string} listingId - The ID of the listing to update.
 * @param {string} status - The new status.
 * @param {string} [rejectionReason] - Optional reason, e.g. if status is 'rejected'.
 * @returns {Promise<object>} A promise that resolves to the updated listing object or success message.
 */
export const updateListingStatusAdmin = async (listingId, status, rejectionReason) => {
  const apiClient = createApiV1AuthorizedInstance(); // Uses /api/v1 base
  const payload = { status };
  if (status === 'rejected' && rejectionReason) {
    payload.rejectionReason = rejectionReason;
  }
  try {
    // Path construction: /listings/admin/:id/status
    const response = await apiClient.patch(`/listings/admin/${listingId}/status`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating status for listing ${listingId} to ${status}:`, error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};


const listingService = {
  getListingsFiltered, // Renamed from getAdminListings for clarity
  approveListing,
  updateListingStatusAdmin, // Renamed from updateListingStatus for clarity
};

export default listingService;
