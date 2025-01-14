import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.css";
import "./Header.css";

const Header = () => {
    const navigate = useNavigate();
    const [isMaximized, setIsMaximized] = useState(false);

    const handleMinimize = () => {
        window.electron.minimizeWindow();
    };

    const handleMaximize = () => {
            window.electron.maximizeWindow();
            setIsMaximized(!isMaximized);
    };

    const handleClose = () => {
        window.electron.closeWindow();
    };

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
                <a onClick={() => navigate("/user")}>My Profile</a>
                <a onClick={() => navigate("/help")}>Help</a>
            </nav>
            <div className="header-buttons">
                <button onClick={() => navigate("/")} className="search-button">
                    Search
                </button>
                <button onClick={() => navigate("/upload")} className="upload-button">
                    Upload
                </button>
            </div>
            <div className="window-controls">
                <button className="control-button" onClick={handleMinimize}>
                    <i className="fa-regular fa-window-minimize"></i>
                </button>
                <button className="control-button" onClick={handleMaximize}>
                    <i className={isMaximized ? "fa-regular fa-window-restore" : "fa-regular fa-square"}></i>
                </button>
                <button className="control-button close-button" onClick={handleClose}>
                    <i className="fas fa-xmark"></i>
                </button>
            </div>
        </header>
    );
};

export default Header;
