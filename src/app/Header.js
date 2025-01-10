import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="header">
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
            <nav className="nav-links">
                <a onClick={() => navigate("/")}>Home</a>
                <a onClick={() => navigate("/user")}>My Profile</a>
                <a onClick={() => navigate("/help")}>Help</a>
            </nav>
            <div className="header-buttons">
            <button onClick={() => navigate("/search")} className="search-button">
                        Search
                    </button>
                    <button onClick={() => navigate("/upload")} className="upload-button">
                        Upload
                    </button>
                </div>
        </header>
    );
};

export default Header;
