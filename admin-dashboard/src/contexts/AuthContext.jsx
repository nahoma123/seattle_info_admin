import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
  const [adminUser, setAdminUser] = useState(null); // Could store decoded token info or user profile

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setAdminToken(token);
      // TODO: Optionally, verify token with backend or decode to get user info here
      // For now, just having the token means "logged in" for MVP
      // Example: setAdminUser({ email: 'admin@example.com', role: 'admin' });
      // This would ideally come from the token or a /auth/me endpoint
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
    if (userData) {
      setAdminUser(userData);
    }
    // else if token can be decoded, decode and set user
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setAdminUser(null);
  };

  // The value passed to the provider includes the token, user, and auth functions
  const value = {
    token: adminToken,
    user: adminUser, // This would be the admin user's details
    isAuthenticated: !!adminToken,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
