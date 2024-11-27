import React, { useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css"; // Import the slider's default styles
import "./App.css";

const App = () => {
    const [filters, setFilters] = useState({
        keywords: ["Human", "brain", "blue"],
        imageModality: true,
        cellMembrane: true,
        fileType: ".jpeg",
        cellSize: [0, 1000], // Min and max values for range
        cellColor: ["blue", "pink", "green"],
    });

    // Handle range slider value changes
    const handleCellSizeChange = (value) => {
        setFilters({ ...filters, cellSize: value });
    };

    return (
        <div className="app-container">
            <div className="sidebar">
                <button className="upload-button">+ Upload image with those tags</button>
                <div className="filters">
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

                    <div className="cell-size">
                        <h3>Cell size</h3>
                        <div className="range-display">
                            <span>{filters.cellSize[0]} µm</span>
                            <span>{filters.cellSize[1]} µm</span>
                        </div>
                        {/* Single slider with two handles */}
                        <Slider
                            range
                            min={0}
                            max={1000}
                            value={filters.cellSize}
                            onChange={handleCellSizeChange}
                            trackStyle={[{ backgroundColor: "#007bff" }]}
                            handleStyle={[
                                { borderColor: "#007bff", backgroundColor: "#007bff" },
                                { borderColor: "#007bff", backgroundColor: "#007bff" },
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
                                <input type="checkbox" defaultChecked={idx === 0} /> {label}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="search-bar">
                    <input type="text" placeholder="Search" />
                </div>
                <div className="results-header">
                    <p>56 results for: blue, brain</p>
                    <div className="view-options">
                        <button>Grid</button>
                        <button>Table</button>
                        <button>List</button>
                    </div>
                </div>
                <div className="results-grid">
                    {Array(56)
                        .fill()
                        .map((_, idx) => (
                            <div className="result-card" key={idx}>
                                <div className="image-placeholder"></div>
                                <p>Name</p>
                                <p>Category</p>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default App;

