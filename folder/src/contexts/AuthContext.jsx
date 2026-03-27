import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on app load
        const checkAuth = async () => {
            const tokenValid = await authService.validateToken();
            if (tokenValid.valid) {
                setUser(authService.getCurrentUser());
            } else {
                authService.logout();
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const register = async (userData) => {
        const result = await authService.register(userData);
        if (result.success) {
            setUser(authService.getCurrentUser());
        }
        return result;
    };

    const login = async (credentials) => {
        const result = await authService.login(credentials);
        if (result.success) {
            setUser(authService.getCurrentUser());
        }
        return result;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated: authService.isAuthenticated,
        getUserRole: authService.getUserRole
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};