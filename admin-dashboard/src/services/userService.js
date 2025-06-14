import axios from 'axios';

const API_BASE_URL = '/api/v1/admin'; // As per documentation

// Helper function to get the auth token from localStorage
// In a more complex app, this might come from AuthContext or a dedicated token manager
const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

// Helper to create authorized axios instance
const createAuthorizedInstance = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Fetches a list of users.
 * @param {object} params - Query parameters for filtering (e.g., { status: 'pending' })
 * @returns {Promise<Array>} A promise that resolves to an array of user objects.
 */
export const getUsers = async (params) => {
  const apiClient = createAuthorizedInstance();
  try {
    const response = await apiClient.get('/users', { params });
    // The API doc shows data might not be nested under a 'data' key for admin user list
    // but it's good practice for list endpoints. Assuming direct array for now based on admin doc summary.
    // If it's { "data": [...] }, then return response.data.data;
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Approves a user.
 * @param {string} userId - The ID of the user to approve.
 * @returns {Promise<object>} A promise that resolves to the updated user object.
 */
export const approveUser = async (userId) => {
  const apiClient = createAuthorizedInstance();
  try {
    const response = await apiClient.post(`/users/${userId}/approve`);
    return response.data;
  } catch (error) {
    console.error(`Error approving user ${userId}:`, error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Rejects a user.
 * @param {string} userId - The ID of the user to reject.
 * @returns {Promise<object>} A promise that resolves to a confirmation or the updated user object.
 *                          (API doc is vague: "Further details on handling rejected users...")
 *                          Assuming a success message or potentially the user object if status changes to 'rejected'.
 */
export const rejectUser = async (userId) => {
  const apiClient = createAuthorizedInstance();
  try {
    // The API doc says "POST /users/{userId}/reject". It might not return the full user object.
    // It might return a success message or status.
    const response = await apiClient.post(`/users/${userId}/reject`);
    return response.data; // Adjust based on actual API response for reject
  } catch (error) {
    console.error(`Error rejecting user ${userId}:`, error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Updates the role of a user.
 * @param {string} userId - The ID of the user to update.
 * @param {string} role - The new role for the user ('user' or 'admin').
 * @returns {Promise<object>} A promise that resolves to the updated user object.
 */
export const updateUserRole = async (userId, role) => {
  const apiClient = createAuthorizedInstance();
  try {
    const response = await apiClient.put(`/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error(`Error updating role for user ${userId}:`, error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Placeholder for PUT /users/{userId}/status if needed directly, though approve/reject handle some cases.
// export const updateUserStatus = async (userId, status) => {
//   const apiClient = createAuthorizedInstance();
//   try {
//     const response = await apiClient.put(`/users/${userId}/status`, { status });
//     return response.data;
//   } catch (error) {
//     console.error(`Error updating status for user ${userId}:`, error.response?.data || error.message);
//     throw error.response?.data || error.message;
//   }
// };


const userService = {
  getUsers,
  approveUser,
  rejectUser,
  updateUserRole,
  // updateUserStatus,
};

export default userService;
