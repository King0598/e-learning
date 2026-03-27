import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RoleRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        switch(user.role) {
            case 'ROLE_ADMIN':
                return <Navigate to="/admin/dashboard" replace />;
            case 'ROLE_MODERATOR':
                return <Navigate to="/moderator/dashboard" replace />;
            default:
                return <Navigate to="/user/dashboard" replace />;
        }
    }

    return <Outlet />;
};

export default RoleRoute;