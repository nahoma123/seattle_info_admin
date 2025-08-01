import axios from 'axios';

const VITE_BASE = import.meta.env.VITE_API_BASE_URL;
const API_V1_BASE_URL = VITE_BASE
  ? (VITE_BASE.endsWith('/api/v1') ? VITE_BASE : `${VITE_BASE}/api/v1`)
  : '/api/v1';

const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

const createApiV1AuthorizedInstance = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_V1_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const getUsers = async (params) => {
  const apiClient = createApiV1AuthorizedInstance();
  try {
    const response = await apiClient.get('/users', { params });
    return response.data;
  } catch (error) {
    const errToThrow = error.response?.data || new Error(error.message || 'Failed to fetch users');
    if (!(errToThrow instanceof Error)) {
        throw new Error(JSON.stringify(errToThrow));
    }
    throw errToThrow;
  }
};

const userService = {
  getUsers,
};

export default userService;
