import React, { useState, useEffect, useCallback } from 'react';
import categoryService from '../services/categoryService';

const styles = {
  container: { padding: '20px', maxWidth: '800px', margin: '0 auto' },
  title: { marginBottom: '20px' },
  formContainer: {
    background: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  inputGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: 'bold' },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    minHeight: '80px'
  },
  button: {
    padding: '10px 15px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    marginRight: '10px'
  },
  buttonDisabled: { backgroundColor: '#aaa', cursor: 'not-allowed' }, // For general disabled state
  actionButton: { padding: '5px 10px', cursor: 'pointer', marginRight: '5px', border: 'none', borderRadius: '4px' },
  editButton: { backgroundColor: '#ffc107' },
  deleteButton: { backgroundColor: '#dc3545', color: 'white' },
  deleteButtonDisabled: { backgroundColor: '#secondary', color: '#6c757d', cursor: 'not-allowed', opacity: 0.65 }, // Specific style for disabled delete
  error: { color: 'red', marginTop: '10px', marginBottom: '10px'},
  loading: { marginTop: '10px', marginBottom: '10px'},
  success: { color: 'green', marginTop: '10px', marginBottom: '10px'},
  paginationControls: { marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  noResults: { marginTop: '10px' }
};

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
  const PAGE_SIZE = 10;

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
  }, [currentPage]);

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

  const handleDeleteCategory = async (categoryId, categoryName) => {
    alert(`Category deletion for "${categoryName}" (ID: ${categoryId}) is temporarily disabled.`);
    // Original delete logic - commented out:
    // if (window.confirm(`Are you sure you want to delete category "${categoryName}" (ID: ${categoryId})?`)) {
    //   setIsLoading(true);
    //   setError('');
    //   setSuccessMessage('');
    //   try {
    //     await categoryService.deleteCategoryAdmin(categoryId);
    //     setSuccessMessage(`Category "${categoryName}" deleted successfully.`);
    //     fetchCategories();
    //   } catch (err) {
    //     setError(err.message || `Failed to delete category "${categoryName}".`);
    //     setIsLoading(false);
    //   }
    // }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Category Management</h1>

      <div style={styles.formContainer}>
        <h2>Add New Category</h2>
        <form onSubmit={handleCreateCategory}>
          {/* Form inputs remain the same */}
          <div style={styles.inputGroup}>
            <label htmlFor="categoryName" style={styles.label}>Name:</label>
            <input type="text" id="categoryName" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} style={styles.input} required />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="categoryDescription" style={styles.label}>Description:</label>
            <textarea id="categoryDescription" value={newCategoryDescription} onChange={(e) => setNewCategoryDescription(e.target.value)} style={styles.textarea} />
          </div>
          {error && !isSubmitting && <p style={styles.error}>{error}</p>} {/* Show general errors when not submitting form */}
          {successMessage && <p style={styles.success}>{successMessage}</p>}
          <button type="submit" style={isSubmitting ? {...styles.button, ...styles.buttonDisabled} : styles.button} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Category'}
          </button>
        </form>
      </div>

      <div style={styles.listContainer}>
        <h2>Existing Categories</h2>
        {isLoading && <p style={styles.loading}>Loading categories...</p>}
        {!isLoading && error && categories.length === 0 && <p style={styles.error}>Could not load categories: {error}</p>}
        {!isLoading && !error && categories.length === 0 && <p style={styles.noResults}>No categories found.</p>}

        {!isLoading && !error && categories.length > 0 && (
          <>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Slug</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td style={styles.td}>{category.id}</td>
                    <td style={styles.td}>{category.name}</td>
                    <td style={styles.td}>{category.slug}</td>
                    <td style={styles.td}>{category.description}</td>
                    <td style={styles.td}>
                      <button
                        onClick={() => handleEditCategory(category.id)}
                        style={{...styles.actionButton, ...styles.editButton}}
                        disabled={isLoading} // Keep edit disabled during general loading for now
                        title="Edit - Not implemented yet"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id, category.name)}
                        style={{...styles.actionButton, ...styles.deleteButtonDisabled}} // Use disabled style
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
            <div style={styles.paginationControls}>
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1 || isLoading}
                style={styles.button}
              >
                Previous
              </button>
              <span>
                Page {pagination.current_page} of {pagination.total_pages} (Total Categories: {pagination.total_records})
              </span>
              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.total_pages || isLoading}
                style={styles.button}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryManagementPage;
