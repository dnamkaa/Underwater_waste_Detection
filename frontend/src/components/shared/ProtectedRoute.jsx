// ProtectedRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const ProtectedRoute = ({ element, roles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/Login" />;
  }

  if (roles.length && !roles.includes(user.role)) {
    console.log(`User role (${user.role}) not authorized, redirecting to home.`);
    return <Navigate to="/" />; // Redirect if the role is unauthorized
  }

  return element;
};

export default ProtectedRoute;
