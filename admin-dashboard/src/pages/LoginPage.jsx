import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('abebe@gmail.com'); // Pre-fill for convenience
  const [password, setPassword] = useState('abebe@123'); // Pre-fill for convenience
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // To redirect after login

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
      // Navigation is handled by useEffect watching isAuthenticated
    } catch (err) {
      console.error("Login page error:", err);
      setError(err.message || 'Failed to login. Check credentials and console.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Styles (copied from previous version for brevity)
  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial, sans-serif' },
    loginBox: { padding: '40px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', textAlign: 'center', width: '100%', maxWidth: '400px' },
    form: { display: 'flex', flexDirection: 'column' },
    inputGroup: { marginBottom: '20px', textAlign: 'left' },
    input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' },
    button: { padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease', opacity: 1 },
    buttonDisabled: { opacity: 0.6, cursor: 'not-allowed' },
    error: { color: 'red', marginBottom: '15px' },
    loadingSpinner: { /* Basic spinner for loading */ display: 'inline-block', border: '4px solid #f3f3f3', borderTop: '4px solid #3498db', borderRadius: '50%', width: '14px', height: '14px', animation: 'spin 1s linear infinite', marginLeft: '10px'}
  };
  // Add keyframes for spin animation if not using global CSS for it
  const keyframesStyle = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;


  if (authIsLoading && !isAuthenticated) { // Show loading indicator if auth state is being determined
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>Loading authentication...</div>;
  }


  return (
    <>
      <style>{keyframesStyle}</style> {/* Inject keyframes */}
      <div style={styles.container}>
        <div style={styles.loginBox}>
          <h2>Admin Login</h2>
          {error && <p style={styles.error}>{error}</p>}

          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input}/>
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input}/>
            </div>
            <button type="submit" style={isSubmitting ? {...styles.button, ...styles.buttonDisabled} : styles.button} disabled={isSubmitting}>
              {isSubmitting ? 'Logging in...' : 'Login'}
              {isSubmitting && <span style={styles.loadingSpinner}></span>}
            </button>
          </form>
          {/* Removed direct token input for cleaner Firebase flow based on plan */}
        </div>
      </div>
    </>
  );
};

export default LoginPage;
