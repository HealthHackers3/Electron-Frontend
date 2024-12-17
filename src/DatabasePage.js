import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./DatabasePage.css";

const DatabasePage = () => {
    const [filters, setFilters] = useState({
        keywords: ["Human", "brain", "blue"],
        imageModality: true,
        cellMembrane: true,
        fileType: ".jpeg",
        cellSize: [0, 1000],
        cellColor: { blue: true, pink: false, green: false },
        cellDensity: { "Label 1": true, "Label 2": false, "Label 3": false },
    });

    const [viewMode, setViewMode] = useState("grid"); // Default view mode
    const [sortOrder, setSortOrder] = useState("newest"); // Default sorting order

    const navigate = useNavigate();

    // Handle navigation to "New Entry Page" for uploading images
    const handleUploadClick = () => {
        navigate("/new-entry");
    };

    // Navigate to the details page when a card is clicked
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
            author: "Dr. Paul Wong",
        };

        const imageUrl = `https://example.com/image/${id}`; // Example image URL

        navigate(`/details/${id}`, {
            state: { imageUrl, properties },
        });
    };

    const handleColorChange = (color) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            cellColor: { ...prevFilters.cellColor, [color]: !prevFilters.cellColor[color] },
        }));
    };

    const handleDensityChange = (label) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            cellDensity: { ...prevFilters.cellDensity, [label]: !prevFilters.cellDensity[label] },
        }));
    };

    const handleViewChange = (mode) => {
        setViewMode(mode);
    };

    const handleSortChange = (order) => {
        setSortOrder(order);
    };

    const sortedResults = () => {
        const results = Array(56)
            .fill()
            .map((_, idx) => ({ id: idx, name: `Name ${idx + 1}`, category: "Category" }));

        if (sortOrder === "newest") return results; // Default order
        if (sortOrder === "oldest") return results.reverse();
        if (sortOrder === "a-z") return results.sort((a, b) => a.name.localeCompare(b.name));
        if (sortOrder === "z-a") return results.sort((a, b) => b.name.localeCompare(a.name));
    };

    return (
        <div className="database-page">
            <div className="sidebar">
                <button className="upload-button" onClick={handleUploadClick}>
                    Upload Images
                </button>
                <div className="filters">
                    {/* Filters */}
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
                            />
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
                            />
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
                            />
                            .jpeg
                        </label>
                    </div>

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
                            onChange={(value) => setFilters({ ...filters, cellSize: value })}
                            trackStyle={[{ backgroundColor: "#e48b3d" }]}
                            handleStyle={[
                                { borderColor: "#e48b3d", backgroundColor: "#e48b3d" },
                                { borderColor: "#e48b3d", backgroundColor: "#e48b3d" },
                            ]}
                        />
                    </div>

                    <div className="cell-color">
                        <h3>Cell color</h3>
                        {Object.keys(filters.cellColor).map((color) => (
                            <label key={color} className="vertical-checkbox">
                                <input
                                    type="checkbox"
                                    checked={filters.cellColor[color]}
                                    onChange={() => handleColorChange(color)}
                                />
                                {color}
                            </label>
                        ))}
                    </div>

                    <div className="cell-density">
                        <h3>Cell density</h3>
                        {Object.keys(filters.cellDensity).map((label) => (
                            <label key={label} className="vertical-checkbox">
                                <input
                                    type="checkbox"
                                    checked={filters.cellDensity[label]}
                                    onChange={() => handleDensityChange(label)}
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="main-content">
                {/* Sorting and View Modes */}
                <div className="results-header">
                    <p>56 results for: {filters.keywords.join(", ")}</p>
                    <div className="view-options">
                        <button
                            onClick={() => handleViewChange("grid")}
                            className={viewMode === "grid" ? "active" : ""}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => handleViewChange("table")}
                            className={viewMode === "table" ? "active" : ""}
                        >
                            Table
                        </button>
                        <button
                            onClick={() => handleViewChange("list")}
                            className={viewMode === "list" ? "active" : ""}
                        >
                            List
                        </button>
                    </div>
                    <div className="sort-options">
                        <button
                            onClick={() => handleSortChange("newest")}
                            className={sortOrder === "newest" ? "active" : ""}
                        >
                            Newest
                        </button>
                        <button
                            onClick={() => handleSortChange("oldest")}
                            className={sortOrder === "oldest" ? "active" : ""}
                        >
                            Oldest
                        </button>
                        <button
                            onClick={() => handleSortChange("a-z")}
                            className={sortOrder === "a-z" ? "active" : ""}
                        >
                            A-Z
                        </button>
                        <button
                            onClick={() => handleSortChange("z-a")}
                            className={sortOrder === "z-a" ? "active" : ""}
                        >
                            Z-A
                        </button>
                    </div>
                </div>

                {/* Results */}
                {viewMode === "grid" && (
                    <div className="results-grid">
                        {sortedResults().map((result) => (
                            <div
                                className="result-card"
                                key={result.id}
                                onClick={() => handleCardClick(result.id)}
                            >
                                <div className="image-placeholder"></div>
                                <p>{result.name}</p>
                                <p>{result.category}</p>
                            </div>
                        ))}
                    </div>
                )}

                {viewMode === "table" && (
                    <div className="results-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedResults().map((result) => (
                                    <tr key={result.id}>
                                        <td>{result.name}</td>
                                        <td>{result.category}</td>
                                        <td>
                                            <button onClick={() => handleCardClick(result.id)}>
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {viewMode === "list" && (
                    <div className="results-list">
                        {sortedResults().map((result) => (
                            <div
                                className="list-item"
                                key={result.id}
                                onClick={() => handleCardClick(result.id)}
                            >
                                <div className="list-content">
                                    <h4>{result.name}</h4>
                                    <p>{result.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DatabasePage;
