import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

// Header component definition
const Header = () => {
    const navigate = useNavigate(); // Initialize navigation

    return (
        // Header container with a CSS class for styling
        <header className="header">
            {/* Logo container: Navigates to the home page when clicked */}
            <div className="logo-container" onClick={() => navigate("/")}>
                <img
                    src="/CellVerse_Logo.png"
                    alt="CellVerse Logo"
                    className="header-logo"
                />
                <img
                    src="/CellVerse_Text.png"
                    alt="CellVerse Text"
                    className="header-text"
                />
            </div>

            {/* Navigation links */}
            <nav className="nav-links">
                {/* Home link */}
                <a onClick={() => navigate("")}>Home</a>
                {/* My Profile link */}
                <a onClick={() => navigate("/user")}>My Profile</a>
                {/* Help link */}
                <a onClick={() => navigate("/help")}>Help</a>
            </nav>

            {/* Header buttons */}
            <div className="header-buttons">
                {/* Search button - navigation to the database Search Page*/}
            <button onClick={() => navigate("/search")} className="search-button">
                        Search
            </button>
            {/* Upload button - navigation to the Upload Page */}
                <button onClick={() => navigate("/upload")} className="upload-button">
                        Upload
                </button>
                    {/* Sign Out button - navigation to the Login Page */}
                <button onClick={() => navigate("/login")} className="sign-out-button">
                    Sign Out
                </button>
                </div>
        </header>
    );
};

export default Header;