import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./app/HomePage";
import SearchPage from "./app/SearchPage";
import DetailsPage from "./app/DetailsPage";
import HelpPage from "./app/HelpPage"; // future implementation req
import UserPage from "./app/UserPage"; // future implementation req
import UploadPage from "./app/UploadPage"; // future implementation req
import Header from "./app/Header";
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import LoginPage from "./auth/LoginPage.js";
import SignupPage from "./auth/SignupPage.js";

const App = () => {
    window.electron.onMessage('port', (port) => {
        console.log(`Port received from main process: ${port}`);
        window.electron.setPort(port); // Store the port in the preload script
    });
    
    return (
        <AuthProvider>
            <Router>
                <Header /> {/* Navigation bar included in all pages */}
                <Routes>
                    <Route path="/home" element={<ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/" element={<ProtectedRoute>
                        <SearchPage />
                    </ProtectedRoute>} />
                    <Route path="/details/:id" element={<DetailsPage />} />
                    <Route path="/help" element={<HelpPage />} />
                    <Route path="/user" element={<ProtectedRoute>
                        <UserPage />
                    </ProtectedRoute>} />
                    <Route path="/upload" element={<ProtectedRoute>
                        <UploadPage />
                    </ProtectedRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;