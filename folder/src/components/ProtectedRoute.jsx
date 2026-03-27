import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUser } from "../utils/auth";

const ProtectedRoute = ({ children, roles = [] }) => {
  const isAuth = isAuthenticated();
  const user = getUser();
  
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  
  // Check role-based access
  if (roles.length > 0 && user) {
    if (!roles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  return children;
};

export default ProtectedRoute;