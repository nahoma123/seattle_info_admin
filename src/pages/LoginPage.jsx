import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

// It's good practice to have specific styles for a page if they are unique,
// but for now, we'll try to use global styles from index.css as much as possible.
// If needed, create LoginPage.css and import it.
// For this iteration, we'll add a few specific styles to index.css for .login-page-container and .login-box,
// and use other global classes like .form-control, .btn, .alert, etc.

const LoginPage = () => {
  const [email, setEmail] = useState('abebe@gmail.com');
  const [password, setPassword] = useState('abebe@123');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && !authIsLoading) {
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authIsLoading, navigate, location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      // Navigation is handled by useEffect
    } catch (err) {
      setError(err.message || 'Failed to login. Check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Inject keyframes for spinner if not already global (it is in current index.css)
  // No, spinner class is already in index.css with its keyframes.

  if (authIsLoading && !isAuthenticated) {
    return (
      <div className="loading-fullscreen-container"> {/* Assuming this class could be global for full screen loaders */}
        <div className="spinner"></div>
        <p>Loading authentication...</p>
      </div>
    );
  }

  return (
    <div className="login-page-container"> {/* Specific class for login page centering */}
      <div className="login-box card"> {/* Use .card for consistent box styling */}
        <div className="card-body"> {/* Use .card-body for padding */}
          <h2 className="card-title text-center mb-3">Admin Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100" // Added w-100 for full width
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
              {isSubmitting && <span className="spinner"></span>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
