import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    return isAuthenticated ? (
        children
    ) : (
        <Navigate to="/login" state={{ parent: location }} />
    );
};

export default ProtectedRoute;
