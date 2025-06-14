import axios from 'axios';

const API_BASE_URL = '/api/v1/admin'; // Admin API endpoint

// Helper function to get the auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

// Helper to create authorized axios instance
const createAuthorizedInstance = () => {
  const token = getAuthToken();
  if (!token) {
    // This case should ideally be caught by ProtectedRoute or similar,
    // but it's a good safeguard.
    console.error("Auth token not found. User might be logged out.");
    // You could throw an error or redirect here, though services typically throw.
    // For now, let axios fail due to lack of token if not caught earlier.
  }
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Fetches a list of listings for admin.
 * @param {object} params - Query parameters for filtering (e.g., { status: 'pending_approval', category_id: 'uuid' })
 * @returns {Promise<Array>} A promise that resolves to an array of listing objects.
 */
export const getAdminListings = async (params) => {
  const apiClient = createAuthorizedInstance();
  try {
    // API doc: GET /listings (admin version might be /admin/listings)
    // Plan and prior services use /api/v1/admin/listings
    const response = await apiClient.get('/listings', { params });
    // Assuming the API returns an array directly, or adjust if it's nested (e.g., response.data.data)
    return response.data;
  } catch (error) {
    console.error('Error fetching admin listings:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Updates the status of a specific listing.
 * @param {string} listingId - The ID of the listing to update.
 * @param {string} status - The new status for the listing (e.g., 'active', 'rejected', 'expired', 'admin_removed').
 * @param {string} [rejectionReason] - Optional reason for rejection, if status is 'rejected'.
 * @returns {Promise<object>} A promise that resolves to the updated listing object.
 */
export const updateListingStatus = async (listingId, status, rejectionReason) => {
  const apiClient = createAuthorizedInstance();
  const payload = { status };
  if (status === 'rejected' && rejectionReason) {
    payload.rejectionReason = rejectionReason;
  }
  // API doc: PUT /listings/{listingId}/status - uses AdminUpdateListingStatusRequest body
  try {
    const response = await apiClient.put(`/listings/${listingId}/status`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating status for listing ${listingId}:`, error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Placeholder for GET /listings/{listingId} - if admin needs to fetch full details of one listing
// export const getAdminListingById = async (listingId) => { ... }

// Placeholder for PUT /listings/{listingId} - if admin needs to edit full listing content
// export const updateAdminListingDetails = async (listingId, listingData) => { ... }

// Placeholder for DELETE /listings/{listingId} - if admin needs to hard delete a listing
// export const deleteAdminListing = async (listingId) => { ... }


const listingService = {
  getAdminListings,
  updateListingStatus,
  // getAdminListingById,
  // updateAdminListingDetails,
  // deleteAdminListing,
};

export default listingService;
