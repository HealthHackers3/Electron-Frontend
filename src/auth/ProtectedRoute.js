import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

/* A component to protect routes by checking if the user is authenticated.
* If the user is not authenticated, they are redirected to the login page. */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // If the user is authenticated, render the child components
    // Otherwise, redirect to the login page and pass the current location as state
    return isAuthenticated ? (
        children
    ) : (
        <Navigate to="/login" state={{ parent: location }} />
    );
};

export default ProtectedRoute;
