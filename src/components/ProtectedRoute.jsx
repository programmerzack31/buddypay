import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
// Assume you have a utility to decode JWT or a service for auth
// import { decodeToken, isTokenValid } from './authUtils';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    // Example of token validation (replace with actual logic)
    // const decoded = decodeToken(token);
    // if (decoded && isTokenValid(decoded)) { // Check expiration, etc.
    if (token) { // Simplified for this example, expand as needed
        setIsAuthenticated(true);
    } else {
        setIsAuthenticated(false);
        // Optionally clear invalid token from localStorage
        localStorage.removeItem("token");
    }
    setIsLoading(false);

  }, []); // Run once on component mount

  if (isLoading) {
    // Or a proper loading spinner component
    return <div>Loading authentication...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;