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
          // console.log("AuthContext: Firebase user signed in, token:", token);
          localStorage.setItem('adminToken', token);
          setAdminToken(token);

          // Fetch/set admin user details. For now, use basic info from firebaseUser.
          // Your backend's /api/v1/auth/me could be called here to get full profile including admin role.
          const userDetails = {
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName
            // role: 'admin' // This should ideally come from your backend or custom claims in token
          };
          // To simulate getting role, let's call our placeholder verify function
          try {
            const adminDetails = await authService.verifyTokenAndGetAdminDetails(token);
            userDetails.role = adminDetails.role; // Add role from verification
          } catch (verifyError) {
             console.warn("Could not verify admin details with token, assuming basic user for now:", verifyError);
             // If verify fails, user might not be an admin. Handle accordingly.
             // For MVP, we might still proceed if token exists, backend will deny.
          }

          localStorage.setItem('adminUser', JSON.stringify(userDetails));
          setAdminUser(userDetails);

        } catch (error) {
          console.error("AuthContext: Error getting ID token or verifying user", error);
          // Clear out potentially stale/invalid data
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setAdminToken(null);
          setAdminUser(null);
        }
      } else {
        // console.log("AuthContext: Firebase user signed out.");
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
      const { token, user: firebaseUserInfo } = await authService.signInUser(email, password);
      // onAuthStateChanged should handle setting token and user in state & localStorage
      // So, this login function mainly just triggers the signIn.
      // However, direct setting can be done if onAuthStateChanged is slow or for immediate UI update.
      // For now, let onAuthStateChanged handle the state updates.
      // If direct update needed:
      // localStorage.setItem('adminToken', token);
      // setAdminToken(token);
      // const userDetails = { email: firebaseUserInfo.email, uid: firebaseUserInfo.uid, role: 'admin' }; // Assume admin for now
      // localStorage.setItem('adminUser', JSON.stringify(userDetails));
      // setAdminUser(userDetails);
      setIsLoading(false);
      return firebaseUserInfo; // Return user info from signIn
    } catch (error) {
      setIsLoading(false);
      console.error("AuthContext login error:", error);
      throw error; // Re-throw for the login page to handle
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.signOutUser();
      // onAuthStateChanged will clear token and user from state & localStorage
    } catch (error) {
      console.error("AuthContext logout error:", error);
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

  if (isLoading && typeof localStorage !== 'undefined' && !localStorage.getItem('adminToken')) {
     // Avoid rendering children during initial async state check if not obviously logged out
     // This prevents brief flashes of protected content or login page.
     // Or simply show a global loader. For now, let it pass to allow immediate rendering.
  }


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
