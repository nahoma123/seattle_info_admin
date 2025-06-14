import axios from 'axios';

const API_V1_BASE_URL = '/api/v1'; // Base for /api/v1 calls

const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

const createApiV1AuthorizedInstance = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_V1_BASE_URL, // This will make requests like /api/v1/users
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Fetches a paginated list of users. Admin-only endpoint.
 * API Endpoint: GET /api/v1/users
 * @param {object} params - Query parameters for filtering and pagination
 *                          (e.g., { page: 1, page_size: 10, email: 'test', name: 'user', role: 'user' })
 * @returns {Promise<object>} A promise that resolves to an object containing 'data' (array of users)
 *                            and 'pagination' info.
 */
export const getUsers = async (params) => {
  const apiClient = createApiV1AuthorizedInstance();
  try {
    // This call will be to: (baseURL)/users -> /api/v1/users
    // Vite should proxy this to http://localhost:8080/api/v1/users
    const response = await apiClient.get('/users', { params });
    return response.data;
  } catch (error) {
    // console.error was removed in cleanup, re-throw for page to handle
    throw error.response?.data || new Error(error.message || 'Failed to fetch users');
  }
};

const userService = {
  getUsers,
};

export default userService;
