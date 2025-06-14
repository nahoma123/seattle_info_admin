import axios from 'axios';

const API_BASE_URL = '/api/v1/admin'; // Admin API endpoint for categories

// Helper function to get the auth token from localStorage
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
 * Fetches a list of all categories.
 * @returns {Promise<Array>} A promise that resolves to an array of category objects.
 * API Doc: GET /categories (admin version is /api/v1/admin/categories)
 * The public API GET /api/v1/categories has pagination. Assuming admin GET /api/v1/admin/categories might too,
 * or might return all. For now, not adding pagination params unless specified as needed for admin.
 * If it returns { "data": [...] }, adjust accordingly. Assuming direct array for now.
 */
export const getCategories = async () => {
  const apiClient = createAuthorizedInstance();
  try {
    const response = await apiClient.get('/categories');
    // Assuming response.data is the array of categories.
    // If API nests it under 'data' (e.g. for pagination object), use response.data.data
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

/**
 * Creates a new category.
 * @param {object} categoryData - The data for the new category.
 *                                Expected: { name: string, description?: string, slug?: string }
 *                                API Doc for POST /categories (public, admin-auth) expects name, description. Slug is auto-generated.
 * @returns {Promise<object>} A promise that resolves to the newly created category object.
 */
export const createCategory = async (categoryData) => {
  const apiClient = createAuthorizedInstance();
  // API doc suggests public POST /api/v1/categories is Admin (Bearer Token) authenticated
  // So, the endpoint is likely /api/v1/categories, not /api/v1/admin/categories for POST
  // Let's check the "Admin API Endpoints Summary" section again.
  // "POST /categories - Creates a new category. Expects category data (e.g., name, slug) in the request body."
  // This endpoint is listed under "Admin API Endpoints Summary" with prefix /api/v1/admin
  // So, POST /api/v1/admin/categories is the correct interpretation.
  try {
    const response = await apiClient.post('/categories', categoryData);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error.response?.data || error.message);
    throw error.response?.data || error.message;
  }
};

// Placeholders for other category management functions if needed later:
// export const getCategoryById = async (categoryId) => { ... } // GET /api/v1/admin/categories/{categoryId}
// export const updateCategory = async (categoryId, categoryData) => { ... } // PUT /api/v1/admin/categories/{categoryId}
// export const deleteCategory = async (categoryId) => { ... } // DELETE /api/v1/admin/categories/{categoryId}


const categoryService = {
  getCategories,
  createCategory,
  // getCategoryById,
  // updateCategory,
  // deleteCategory,
};

export default categoryService;
