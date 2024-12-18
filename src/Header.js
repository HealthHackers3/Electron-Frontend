import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <h1 className="logo" onClick={() => navigate("/")}>
                CellVerse
            </h1>
            <nav>
                <a onClick={() => navigate("/")}>Home</a>
                <a onClick={() => navigate("/help")}>Help</a>
                <a onClick={() => navigate("/user")}>My Profile</a>
            </nav>
            <div className="header-buttons">
                <button onClick={() => navigate("/database")} className="search-button">
                    Search
                </button>
                <button onClick={() => navigate("/new-entry")} className="upload-button">
                    Upload
                </button>
            </div>
        </header>
    );
};

export default Header;
