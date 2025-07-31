import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService'; // Using the updated authService

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
  const [adminUser, setAdminUser] = useState(JSON.parse(localStorage.getItem('adminUser'))); // Store user object
  const [isLoading, setIsLoading] = useState(true); // For initial auth state check

  useEffect(() => {
    // Subscribe to Firebase auth state changes
    const unsubscribe = authService.onAuthUserChanged(async (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('adminToken', token);
          setAdminToken(token);

          const userDetails = {
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName
          };
          try {
            const adminDetails = await authService.verifyTokenAndGetAdminDetails(token);
            userDetails.role = adminDetails.role;
          } catch (verifyError) {
             // If verify fails, user might not be an admin. Handle accordingly.
             // For MVP, we might still proceed if token exists, backend will deny.
          }

          localStorage.setItem('adminUser', JSON.stringify(userDetails));
          setAdminUser(userDetails);

        } catch (error) {
          // Clear out potentially stale/invalid data
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setAdminToken(null);
          setAdminUser(null);
        }
      } else {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        setAdminToken(null);
        setAdminUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const { user: firebaseUserInfo } = await authService.signInUser(email, password);
      // onAuthStateChanged should handle setting token and user in state & localStorage
      setIsLoading(false);
      return firebaseUserInfo; // Return user info from signIn
    } catch (error) {
      setIsLoading(false);
      throw error; // Re-throw for the login page to handle
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.signOutUser();
      // onAuthStateChanged will clear token and user from state & localStorage
    } catch (error) {
      // Still clear client state even if Firebase signout fails for some reason
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setAdminToken(null);
      setAdminUser(null);
      throw error;
    } finally {
        setIsLoading(false);
    }
  };

  const value = {
    token: adminToken,
    user: adminUser,
    isAuthenticated: !!adminToken && !!adminUser, // Check for both token and user object
    isLoading, // Expose loading state for UI
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
