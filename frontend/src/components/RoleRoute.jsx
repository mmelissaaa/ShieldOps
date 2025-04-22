// src/components/RoleRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const RoleRoute = ({ children, role }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Check if user has the required role
  if (user?.role !== role) {
    // Redirect to appropriate dashboard based on user role
    if (user?.role === 'employee') {
      return <Navigate to="/employee/dashboard" />;
    } else if (user?.role === 'manager') {
      return <Navigate to="/manager/dashboard" />;
    } else {
      return <Navigate to="/login" />;
    }
  }
  
  return children;
};

export default RoleRoute;
