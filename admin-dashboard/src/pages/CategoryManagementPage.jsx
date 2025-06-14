import React, { useState, useEffect, useCallback } from 'react';
import categoryService from '../services/categoryService';

// Using global styles from index.css

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, page_size: 10, total_records: 0, total_pages: 1 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10; // Defined by API for categories list

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const params = { page: currentPage, page_size: PAGE_SIZE };
      const response = await categoryService.getCategories(params);
      setCategories(response.data || []);
      setPagination(response.pagination || { current_page: currentPage, page_size: PAGE_SIZE, total_records: (response.data || []).length, total_pages: Math.ceil((response.data || []).length / PAGE_SIZE) });
    } catch (err) {
      setError(err.message || 'Failed to fetch categories.');
      setCategories([]);
      setPagination({ current_page: currentPage, page_size: PAGE_SIZE, total_records: 0, total_pages: 1 });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]); // PAGE_SIZE is constant, so not needed in deps if defined outside

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('Category name is required.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');
    try {
      const newCategoryData = {
        name: newCategoryName,
        description: newCategoryDescription
      };
      await categoryService.createCategory(newCategoryData);
      setSuccessMessage(`Category '${newCategoryName}' created successfully!`);
      setNewCategoryName('');
      setNewCategoryDescription('');
      setCurrentPage(1);
      fetchCategories();
    } catch (err) {
      setError(err.message || 'Failed to create category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleEditCategory = (categoryId) => {
    alert(`Edit category ID: ${categoryId} - (Not implemented yet)`);
  };

  const handleDeleteCategory = (categoryId, categoryName) => {
    alert(`Category deletion for "${categoryName}" (ID: ${categoryId}) is temporarily disabled.`);
  };

  return (
    <div className="container mt-3">
      <h2 className="mb-3">Category Management</h2>

      <div className="card mb-3">
        <div className="card-header">
            <h3 className="card-title mb-0">Add New Category</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleCreateCategory}>
            <div className="form-group">
              <label htmlFor="categoryName" className="form-label">Name:</label>
              <input
                type="text"
                id="categoryName"
                className="form-control"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="categoryDescription" className="form-label">Description:</label>
              <textarea
                id="categoryDescription"
                className="form-control"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                rows="3"
              />
            </div>
            {/* Display errors and success messages related to form submission */}
            {isSubmitting && <div className="spinner mt-2 mb-2"></div>}
            {!isSubmitting && error && <div className="alert alert-danger mt-2">{error}</div>}
            {!isSubmitting && successMessage && <div className="alert alert-success mt-2">{successMessage}</div>}
            <button
              type="submit"
              className="btn btn-primary mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Category'}
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
            <h3 className="card-title mb-0">Existing Categories</h3>
        </div>
        <div className="card-body">
            {isLoading && !isSubmitting && <div className="text-center"><div className="spinner"></div> <p>Loading categories...</p></div>}
            {!isLoading && !isSubmitting && error && categories.length === 0 && <div className="alert alert-danger">{error}</div>} {/* Error specifically for list loading */}
            {!isLoading && !isSubmitting && !error && categories.length === 0 && <div className="alert alert-info">No categories found.</div>}

            {!isLoading && !error && categories.length > 0 && (
            <>
                <div className="table-responsive">
                <table className="table table-hover">
                <thead>
                    <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Description</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                    <tr key={category.id}>
                        <td>{category.id}</td>
                        <td>{category.name}</td>
                        <td>{category.slug}</td>
                        <td>{category.description}</td>
                        <td>
                        <button
                            onClick={() => handleEditCategory(category.id)}
                            className="btn btn-warning btn-sm me-1" // Added me-1 for margin
                            disabled={isLoading || isSubmitting}
                            title="Edit - Not implemented yet"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDeleteCategory(category.id, category.name)}
                            className="btn btn-secondary btn-sm" // Changed to btn-secondary for disabled visual
                            disabled // Always disabled
                            title="Delete - Temporarily disabled"
                        >
                            Delete
                        </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
                </div>
                <div className="pagination-controls mt-3 d-flex justify-content-between align-items-center">
                <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page <= 1 || isLoading || isSubmitting}
                    className="btn btn-secondary"
                >
                    Previous
                </button>
                <span>
                    Page {pagination.current_page} of {pagination.total_pages} (Total Categories: {pagination.total_records})
                </span>
                <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page >= pagination.total_pages || isLoading || isSubmitting}
                    className="btn btn-secondary"
                >
                    Next
                </button>
                </div>
            </>
            )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagementPage;
