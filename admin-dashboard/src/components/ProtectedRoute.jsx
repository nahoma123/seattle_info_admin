import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to so we can send them along after they login.
    // The 'state' prop can be used for this, but for simplicity in MVP,
    // we'll just redirect to login. A more advanced setup might pass 'location'.
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child components.
  // Outlet is used when this is a wrapper for nested routes.
  // If children is directly passed, render children.
  // For admin layout wrapping, Outlet is typical.
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
