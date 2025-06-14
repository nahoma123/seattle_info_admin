import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService'; // If needed for future API calls

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tokenInput, setTokenInput] = useState(''); // Renamed from 'token' to avoid conflict
  const [error, setError] = useState('');
  const { login, isAuthenticated, token: authToken } = useAuth(); // Get auth context
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already authenticated, redirect from login page
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    // Simulate login for MVP
    if (email === 'admin@example.com' && password === 'password') {
      const mockToken = 'fake-firebase-admin-id-token-' + Date.now();
      // Simulate getting user data after login
      const mockUserData = { email: 'admin@example.com', role: 'admin', name: 'Mock Admin' };
      login(mockToken, mockUserData); // Call context login
      navigate('/admin');
    } else {
      setError('Invalid credentials. Try admin@example.com / password.');
    }
  };

  const handleTokenLogin = async () => {
    setError('');
    if (tokenInput.trim() !== '') {
      // Optionally, you could try to verify the token here using authService.verifyTokenAndGetUser
      // For MVP, directly use the token. The backend will validate it on API calls.
      try {
        // const userData = await authService.verifyTokenAndGetUser(tokenInput); // Optional step
        // For now, assume any pasted token is for an admin
        const userData = { role: 'admin', name: 'Pasted Token Admin' }
        login(tokenInput, userData);
        navigate('/admin');
      } catch (err) {
        setError('Could not verify token or token is invalid.');
      }
    } else {
        setError('Please paste a token.');
    }
  };

  // Styles (copied from previous version for brevity, assuming they are the same)
  const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial, sans-serif' },
    loginBox: { padding: '40px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', textAlign: 'center', width: '100%', maxWidth: '400px' },
    form: { display: 'flex', flexDirection: 'column' },
    inputGroup: { marginBottom: '20px', textAlign: 'left' },
    input: { width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px', boxSizing: 'border-box' },
    textarea: { minHeight: '60px', resize: 'vertical' },
    button: { padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer', transition: 'background-color 0.3s ease' },
    tokenButton: { backgroundColor: '#28a745' },
    error: { color: 'red', marginBottom: '15px' },
    hr: { margin: '20px 0', borderColor: '#eee' }
  };

  return (
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
          <button type="submit" style={styles.button}>Login with Email/Password</button>
        </form>

        <hr style={styles.hr} />

        <div style={styles.form}>
            <p style={{textAlign: 'center', marginBottom: '10px'}}>Or login with a Firebase ID Token:</p>
             <div style={styles.inputGroup}>
                <label htmlFor="tokenInput">Admin Token</label>
                <textarea id="tokenInput" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} rows="3" style={{...styles.input, ...styles.textarea}} placeholder="Paste Firebase ID Token here"/>
            </div>
            <button onClick={handleTokenLogin} style={{...styles.button, ...styles.tokenButton}}>Login with Token</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
