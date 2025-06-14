import React, { useState, useEffect, useCallback } from 'react';
import categoryService from '../services/categoryService'; // Import the categoryService

// Basic inline styles
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
    borderRadius: '4px'
  },
  buttonDisabled: { backgroundColor: '#aaa' },
  listContainer: { marginTop: '20px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  th: { border: '1px solid #ddd', padding: '10px', background: '#f4f4f4', textAlign: 'left' },
  td: { border: '1px solid #ddd', padding: '10px', textAlign: 'left' },
  error: { color: 'red', marginTop: '10px', marginBottom: '10px'},
  loading: { marginTop: '10px', marginBottom: '10px'},
  success: { color: 'green', marginTop: '10px', marginBottom: '10px'}
};

const CategoryManagementPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await categoryService.getCategories();
      setCategories(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch categories.');
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      fetchCategories(); // Refresh list
    } catch (err) {
      setError(err.message || 'Failed to create category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Category Management</h1>

      <div style={styles.formContainer}>
        <h2>Add New Category</h2>
        <form onSubmit={handleCreateCategory}>
          <div style={styles.inputGroup}>
            <label htmlFor="categoryName" style={styles.label}>Name:</label>
            <input
              type="text"
              id="categoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="categoryDescription" style={styles.label}>Description:</label>
            <textarea
              id="categoryDescription"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              style={styles.textarea}
            />
          </div>
          {error && <p style={styles.error}>{error}</p>}
          {successMessage && <p style={styles.success}>{successMessage}</p>}
          <button
            type="submit"
            style={isSubmitting ? {...styles.button, ...styles.buttonDisabled} : styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Category'}
          </button>
        </form>
      </div>

      <div style={styles.listContainer}>
        <h2>Existing Categories</h2>
        {isLoading && <p style={styles.loading}>Loading categories...</p>}
        {!isLoading && error && categories.length === 0 && <p style={styles.error}>Could not load categories: {error}</p>}
        {!isLoading && !error && categories.length === 0 && <p>No categories found.</p>}

        {!isLoading && !error && categories.length > 0 && (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Slug</th>
                <th style={styles.th}>Description</th>
                {/* Add Created At/Updated At if available and needed */}
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td style={styles.td}>{category.id}</td>
                  <td style={styles.td}>{category.name}</td>
                  <td style={styles.td}>{category.slug}</td>
                  <td style={styles.td}>{category.description}</td>
                  {/* Add more actions like Edit/Delete here if implemented */}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CategoryManagementPage;
