import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./DatabasePage.css";

const DatabasePage = () => {
    const [filters, setFilters] = useState({
        keywords: "",
        selectedCategories: [],
        selectedColors: [],
        //imageModality: true,
        selectedFileTypes: [],
        cellSize: [0, 1000],

    });

    const [viewMode, setViewMode] = useState("grid"); // Default view mode
    const [sortOrder, setSortOrder] = useState("newest"); // Default sorting order
    const [data, setData] = useState([]); // Mock database
    const [uniqueCategories, setUniqueCategories] = useState([]);
    const [uniqueColors, setUniqueColors] = useState([]);
    const [uniqueFileTypes, setUniqueFileTypes] = useState([]);

    const navigate = useNavigate();

    // Simulate data (ONCE WE HAVE DATABASE - REPLACE)
    useEffect(() => {
        const fetchData = () => {
            const mockData = Array(56)
                .fill()
                .map((_, idx) => ({
                    id: idx,
                    name: `Cell ${idx + 1}`,
                    category: `Category ${idx % 5 + 1}`,
                    color: ["blue", "green", "pink"][idx % 3],
                    size: Math.floor(Math.random() * 1000),
                    imageUrl: `https://via.placeholder.com/150?text=Cell+${idx + 1}`,
                }));

            setData(mockData);


            setUniqueCategories([...new Set(mockData.map((item) => item.category))]);
            setUniqueColors([...new Set(mockData.map((item) => item.color))]);
        };

        fetchData();
    }, []);


    // Handle navigation to "New Entry Page" for uploading images
    const handleUploadClick = () => {
        navigate("/new-entry");
    };

    // Navigate to the details page when a card is clicked
    const handleCardClick = (id) => {
        navigate(`/details/${id}`);
        };

    const handleCategoryChange = (category) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            selectedCategories: prevFilters.selectedCategories.includes(category)
                ? prevFilters.selectedCategories.filter((item) => item !== category)
                : [...prevFilters.selectedCategories, category],
        }));
    }

    const handleColorChange = (color) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            selectedColors: prevFilters.selectedColors.includes(color)
                    ? prevFilters.selectedColors.filter((col) => col !== color)
                    : [...prevFilters.selectedColors, color],
        }));
    };

    const handleViewChange = (mode) => {
        setViewMode(mode);
    };

    const handleSortChange = (order) => {
        setSortOrder(order);
    };

    const filteredResults = () => {
        let results = [...data];

        // Apply filters
        if (filters.keywords) {
            results = results.filter((item) =>
                item.name.toLowerCase().includes(filters.keywords.toLowerCase())
            );
        }
        if (filters.selectedCategories.length > 0) {
            results = results.filter((item) => filters.selectedCategories.includes(item.category));
        }
        if (filters.selectedColors.length > 0) {
            results = results.filter((item) => filters.selectedColors.includes(item.color));
        }
        results = results.filter(
            (item) => item.size >= filters.cellSize[0] && item.size <= filters.cellSize[1]
        );

        return results;
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
                    {/* Search Bar */}
                    <div className="search-bar">
                        <h3>Search</h3>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={filters.keywords}
                            onChange={(e) =>
                                setFilters({ ...filters, keywords: e.target.value })
                            }
                        />
                    </div>

                    {/* Categories */}
                    <div className="filter-section">
                    <h3>Categories</h3>
                        {uniqueCategories.map((category) => (
                            <label key={category}
                                   className="vertical-checkbox"
                                   style={{display: "block", marginBottom: "10px"}}
                            >
                                <input
                    type="checkbox"
                    checked={filters.selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                />
                {category}
            </label>
        ))}
    </div>

        {/* Colors */}
        <div className="filter-section">
            <h3>Colors</h3>
            {uniqueColors.map((color) => (
                <label key={color}
                       className="vertical-checkbox"
                        style={{display: "block", marginBottom: "10px"}}
                >
                    <input
                        type="checkbox"
                        checked={filters.selectedColors.includes(color)}
                        onChange={() => handleColorChange(color)}
                    />
                    {color}
                </label>
            ))}
        </div>

        {/* Cell Size */}
        <div className="filter-section">
            <h3>Cell Size</h3>
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
    </div>
    </div>

        <div className="main-content">
            <div className="results-header">
                <p>{filteredResults().length} results found</p>
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
                </div>
                <div className="sort-options">
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
            <div className={`results-${viewMode}`}>
                {filteredResults().map((result) => (
                    <div
                        className="result-card"
                        key={result.id}
                        onClick={() => handleCardClick(result.id)}
                    >
                        <img src={result.imageUrl} alt={result.name} />
                        <p>{result.name}</p>
                        <p>{result.category}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
    );
};

export default DatabasePage;
