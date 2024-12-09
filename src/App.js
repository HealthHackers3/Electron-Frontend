import React, { useState } from "react";
import {BrowserRouter as Router, Route, Routes, useNavigate, useParams} from "react-router-dom";
import Slider from "rc-slider";
import DetailsPage from "./DetailsPage";
import "rc-slider/assets/index.css";
import "./App.css";

// Main App Component
const App = () => {
    const [filters, setFilters] = useState({
        keywords: ["Human", "brain", "gray"],
        imageModality: true,
        cellMembrane: true,
        fileType: ".jpeg",
        cellSize: [0, 1000],
        cellColor: ["gray", "pink", "green"],
    });

    const handleCellSizeChange = (value) => {
        setFilters({ ...filters, cellSize: value });
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home filters={filters} onCellSizeChange={handleCellSizeChange} />} />
                <Route path="/details/:id" element={<DetailsPage />} />
            </Routes>
        </Router>
    );
};

// Home Component
const Home = ({ filters, onCellSizeChange }) => {
    const navigate = useNavigate();

    const handleCardClick = (id) => {
        const properties = {
            category: "Sample Category",
            cellType: "Neuron",
            cellDensity: "Medium",
            cellWidth: 50,
            cellHeight: 70,
            cellArea: 3500,
            cellCount: 100,
            imageModality: "Brightfield",
            author: "Dr. John Doe",
        };

        const imageUrl = `https://th.bing.com/th/id/R.479f9d7475e53ead9717a83c03f9da2f?rik=TX%2fqy%2fF%2fu5WdXg&pid=ImgRaw&r=0`; // Replace with your actual image URL

        navigate(`/details/${id}`, {
            state: { imageUrl, properties }, // Pass the image URL and properties
        });
    };

    return (
        <div className="app-container">
            <div className="sidebar">
                {/* Sidebar content */}
                <button className="upload-button">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="upload-icon"
                    >
                        <path
                            d="M12 2a1 1 0 0 1 1 1v8h8a1 1 0 1 1 0 2h-8v8a1 1 0 1 1-2 0v-8H3a1 1 0 1 1 0-2h8V3a1 1 0 0 1 1-1z"
                            fill="currentColor"
                        />
                    </svg>
                    Upload images
                </button>
                <div className="filters">
                    {/* Keywords */}
                    <div>
                        <h3>Keywords</h3>
                        <div className="keywords">
                            {filters.keywords.map((keyword, idx) => (
                                <span className="keyword" key={idx}>
                                    {keyword} <span>x</span>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="checkbox-group">
                        <h3>Options</h3>
                        <label>
                            <input
                                type="checkbox"
                                checked={filters.imageModality}
                                onChange={() =>
                                    setFilters({
                                        ...filters,
                                        imageModality: !filters.imageModality,
                                    })
                                }
                            />{" "}
                            Image modality
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={filters.cellMembrane}
                                onChange={() =>
                                    setFilters({
                                        ...filters,
                                        cellMembrane: !filters.cellMembrane,
                                    })
                                }
                            />{" "}
                            Cell membrane
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={filters.fileType === ".jpeg"}
                                onChange={() =>
                                    setFilters({
                                        ...filters,
                                        fileType: filters.fileType === ".jpeg" ? "" : ".jpeg",
                                    })
                                }
                            />{" "}
                            .jpeg
                        </label>
                    </div>

                    {/* Cell size */}
                    <div className="cell-size">
                        <h3>Cell size</h3>
                        <div className="range-display">
                            <span>{filters.cellSize[0]} µm</span>
                            <span>{filters.cellSize[1]} µm</span>
                        </div>
                        <Slider
                            range
                            min={0}
                            max={1000}
                            value={filters.cellSize}
                            onChange={onCellSizeChange}
                            trackStyle={[{ backgroundColor: "#e48b3d" }]}
                            handleStyle={[
                                { borderColor: "#e48b3d", backgroundColor: "#e48b3d", boxShadow: "None" },
                                { borderColor: "#e48b3d", backgroundColor: "#e48b3d", boxShadow: "None" },
                            ]}
                        />
                    </div>

                    <div className="cell-color">
                        <h3>Cell color</h3>
                        {filters.cellColor.map((color, idx) => (
                            <label key={idx}>
                                <input
                                    type="checkbox"
                                    defaultChecked={color === "blue"}
                                    onChange={() =>
                                        setFilters({
                                            ...filters,
                                            cellColor: filters.cellColor.map((c, i) =>
                                                i === idx ? !c : c
                                            ),
                                        })
                                    }
                                />{" "}
                                {color}
                            </label>
                        ))}
                    </div>

                    <div className="cell-density">
                        <h3>Cell density</h3>
                        {["Label 1", "Label 2", "Label 3"].map((label, idx) => (
                            <label key={idx}>
                                <input type="checkbox" defaultChecked={idx === 4}/> {label}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="search-bar">
                    <input type="text" placeholder="Search"/>
                </div>
                <div className="results-header">
                    <p>56 results for: blue, brain</p>
                </div>
                <div className="results-grid">
                    {Array(56)
                        .fill()
                        .map((_, idx) => (
                            <div
                                className="result-card"
                                key={idx}
                                onClick={() => handleCardClick(idx)} // Pass the unique id to the click handler
                                style={{cursor: "pointer"}}
                            >
                                <div className="image-placeholder"></div>
                                <p>Name {idx + 1}</p>
                                <p>Category</p>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default App;

