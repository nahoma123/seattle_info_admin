import axios from 'axios';

const API_V1_BASE_URL = '/api/v1'; // Base for /api/v1 calls

const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

// Instance for calls to /api/v1 (like GET /api/v1/users)
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

/**
 * Fetches a paginated list of users. Admin-only endpoint.
 * Allows filtering by email, name, and role.
 * API Endpoint: GET /api/v1/users
 * @param {object} params - Query parameters for filtering and pagination
 *                          (e.g., { page: 1, page_size: 10, email: 'test', name: 'user', role: 'user' })
 * @returns {Promise<object>} A promise that resolves to an object containing 'data' (array of users)
 *                            and 'pagination' info.
 */
export const getUsers = async (params) => {
  const apiClient = createApiV1AuthorizedInstance();
  try {
    const response = await apiClient.get('/users', { params });
    // API response structure: { message, data: [users], pagination: {} }
    // We need to return both data and pagination for the component to use.
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// approveUser, rejectUser, updateUserRole functions are removed as per user feedback.

const userService = {
  getUsers,
};

export default userService;
