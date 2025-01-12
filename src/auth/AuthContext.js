import React, { createContext, useState, useContext } from 'react';
import {loginUser} from "../api/authAPI";

// Create a context for authorization
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication status

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
