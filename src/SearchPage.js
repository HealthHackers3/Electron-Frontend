import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./SearchPage.css";

const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        keywords: "",
        selectedCategories: [],
        selectedTypes: [],
        selectedImageModality: [],
        selectedShapes: [],
        selectedFileTypes: [],
        cellSize: [0, 1000],
        cellCount: [0, 1000],
    });

    const resetFilters = () => {
        setFilters({
            keywords: "",
            selectedCategories: [],
            selectedTypes: [],
            selectedImageModality: [],
            selectedShapes: [],
            selectedFileTypes: [],
            cellSize: [0, 1000],
            cellCount: [0, 1000],
        });
    };

    const [viewMode, setViewMode] = useState("grid"); // Default view mode
    const [sortOrder, setSortOrder] = useState("newest"); // Default sorting order
    const [data, setData] = useState([]); // Mock database
    const [uniqueCategories, setUniqueCategories] = useState([]);
    const [uniqueTypes, setUniqueTypes] = useState([]);
    const [uniqueImageModalities, setUniqueImageModalities] = useState([]);
    const [uniqueShapes, setUniqueShapes] = useState([]);
    const [uniqueFileTypes, setUniqueFileTypes] = useState([]);

    // New State for Sidebar Visibility
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed((prev) => !prev);
    };

    useEffect(() => {
        fetchResults(); // Replace with actual API call
    }, []);

    const fetchResults = async () => {
        try {
            // Replace with API call
            const response = await fetch('/api/results');
            const data = await response.json();
            setResults(data || []);
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (location.state?.newEntry) {
            const newEntry = { ...location.state.newEntry, id: data.length }; // Add a unique ID

            // Update data
            setData((prevData) => {
                const updatedData = [...prevData, newEntry];

                // Update unique categories, types, and other properties
                setUniqueCategories((prevCategories) => [
                    ...new Set([...prevCategories, newEntry.category]),
                ]);
                setUniqueTypes((prevTypes) => [
                    ...new Set([...prevTypes, newEntry.type]),
                ]);
                setUniqueImageModalities((prevModalities) => [
                    ...new Set([...prevModalities, newEntry.imageModality]),
                ]);
                setUniqueShapes((prevShapes) => [
                    ...new Set([...prevShapes, newEntry.shape]),
                ]);
                setUniqueFileTypes((prevFileTypes) => [
                    ...new Set([...prevFileTypes, newEntry.fileType]),
                ]);

                return updatedData;
            });
        }
    }, [location.state, data]);

    // Handle navigation to "New Entry Page" for uploading images
    const handleUploadClick = () => {
        navigate("/new-entry");
    };

    // Navigate to the details page
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

    const handleTypeChange = (type) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            selectedTypes: prevFilters.selectedTypes.includes(type)
                ? prevFilters.selectedTypes.filter((item) => item !== type)
                : [...prevFilters.selectedTypes, type],
        }));
    }

    const handleImageModalityChange = (imageModality) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            selectedImageModality: prevFilters.selectedImageModality.includes(imageModality)
                ? prevFilters.selectedImageModality.filter((item) => item !== imageModality)
                : [...prevFilters.selectedImageModality, imageModality],
        }));
    }

    const handleShapeChange = (shape) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            selectedShapes: prevFilters.selectedShapes.includes(shape)
                ? prevFilters.selectedShapes.filter((item) => item !== shape)
                : [...prevFilters.selectedShapes, shape],
        }));
    }

    const handleFileTypeChange = (fileType) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            selectedFileTypes: prevFilters.selectedFileTypes.includes(fileType)
                ? prevFilters.selectedFileTypes.filter((item) => item !== fileType)
                : [...prevFilters.selectedFileTypes, fileType],
        }));
    }

    const handleViewChange = (mode) => {
        setViewMode(mode);
    };

    const handleSortChange = (order) => {
        setSortOrder(order);
    };

    const filteredResults = () => {
        let results = Array.isArray(data) ? [...data] : []; // Ensure `data` is always an array

        // Apply filters
        if (filters.keywords) {
            results = results.filter((item) =>
                item.name.toLowerCase().includes(filters.keywords.toLowerCase())
            );
        }
        if (filters.selectedCategories.length > 0) {
            results = results.filter((item) => filters.selectedCategories.includes(item.category));
        }
        if (filters.selectedTypes.length > 0) {
            results = results.filter((item) => filters.selectedTypes.includes(item.type));
        }
        if (filters.selectedImageModality.length > 0) {
            results = results.filter((item) => filters.selectedImageModality.includes(item.imageModality));
        }
        if (filters.selectedShapes.length > 0) {
            results = results.filter((item) => filters.selectedShapes.includes(item.shape));
        }
        if (filters.selectedFileTypes.length > 0) {
            results = results.filter((item) => filters.selectedFileTypes.includes(item.fileType));
        }
        if (filters.cellCount[0] > 0 || filters.cellCount[1] < 1000) {
            results = results.filter(
                (item) => item.count >= filters.cellCount[0] && item.count <= filters.cellCount[1]
            );
        }
        if (filters.cellSize[0] > 0 || filters.cellSize[1] < 1000) {
            results = results.filter(
                (item) => item.size >= filters.cellSize[0] && item.size <= filters.cellSize[1]
            );
        }
        results = results.filter(
            (item) => item.size >= filters.cellSize[0] && item.size <= filters.cellSize[1]
        );
        return results;
    };

    const sortedResults = () => {
        let results = filteredResults();

        if (sortOrder === "newest") return results; // Default order
        if (sortOrder === "oldest") return results.reverse();
        if (sortOrder === "a-z") return results.sort((a, b) => a.name.localeCompare(b.name));
        if (sortOrder === "z-a") return results.sort((a, b) => b.name.localeCompare(a.name));

        return results;
    };

    // Inline SVGs for toggle button
    const ExpandIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-chevron-right"
        >
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
    );

    const CollapseIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-chevron-left"
        >
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
    );

    return (
        <div className="search-page">
            {/* Sidebar */}
            <div className={`sidebar ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                {/* Toggle Button */}
                <button className="toggle-button" onClick={toggleSidebar}>
                    {isSidebarCollapsed ? ExpandIcon : CollapseIcon}
                </button>

                {/* Existing Sidebar Content */}
                <div className="filters">
                    {/* Categories */}
                    <div className="filter-section">
                        <h3>Categories</h3>
                        {uniqueCategories.map((category) => (
                            <label key={category} className="vertical-checkbox">
                                <input
                                    type="checkbox"
                                    checked={filters.selectedCategories.includes(category)}
                                    onChange={() => handleCategoryChange(category)}
                                />
                                {category}
                            </label>
                        ))}
                    </div>
                    {/* Types */}
                    <div className="filter-section">
                        <h3>Types</h3>
                        {uniqueTypes.map((type) => (
                            <label key={type} className="vertical-checkbox">
                                <input
                                    type="checkbox"
                                    checked={filters.selectedTypes.includes(type)}
                                    onChange={() => handleTypeChange(type)}
                                />
                                {type}
                            </label>
                        ))}
                    </div>
                    {/* Image Modality */}
                    <div className="filter-section">
                        <h3>Image Modality</h3>
                        {uniqueImageModalities.map((imageModality) => (
                            <label key={imageModality} className="vertical-checkbox">
                                <input
                                    type="checkbox"
                                    checked={filters.selectedImageModality.includes(imageModality)}
                                    onChange={() => handleImageModalityChange(imageModality)}
                                />
                                {imageModality}
                            </label>
                        ))}
                    </div>
                    {/* Shapes */}
                    <div className="filter-section">
                        <h3>Shapes</h3>
                        {uniqueShapes.map((shape) => (
                            <label key={shape} className="vertical-checkbox">
                                <input
                                    type="checkbox"
                                    checked={filters.selectedShapes.includes(shape)}
                                    onChange={() => handleShapeChange(shape)}
                                />
                                {shape}
                            </label>
                        ))}
                    </div>
                    {/* File Types */}
                    <div className="filter-section">
                        <h3>File Types</h3>
                        {uniqueFileTypes.map((fileType) => (
                            <label key={fileType} className="vertical-checkbox">
                                <input
                                    type="checkbox"
                                    checked={filters.selectedFileTypes.includes(fileType)}
                                    onChange={() => handleFileTypeChange(fileType)}
                                />
                                {fileType}
                            </label>
                        ))}
                    </div>
                    {/* Cell Size */}
                    <div className="cell-size">
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
                        />
                    </div>
                    {/* Cell Count */}
                    <div className="cell-count">
                        <h3>Cell Count</h3>
                        <div className="range-display">
                            <span>{filters.cellCount[0]}</span>
                            <span>{filters.cellCount[1]}</span>
                        </div>
                        <Slider
                            range
                            min={0}
                            max={1000}
                            value={filters.cellCount}
                            onChange={(value) => setFilters({ ...filters, cellCount: value })}
                        />
                    </div>
                    {/* Reset Filters Button */}
                    <button className="reset-button" onClick={resetFilters}>
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-container">
                <div className="results-header">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="🔍 Search by name or tags..."
                        value={filters.keywords}
                        onChange={(e) =>
                            setFilters({ ...filters, keywords: e.target.value })
                        }
                    />
                    <div className="header-actions">
                        <div className="view-options">
                            <button
                                onClick={() => handleViewChange('grid')}
                                className={viewMode === 'grid' ? 'active' : ''}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => handleViewChange('list')}
                                className={viewMode === 'list' ? 'active' : ''}
                            >
                                List
                            </button>
                        </div>
                        <div className="sort-options">
                            <button
                                onClick={() => handleSortChange('a-z')}
                                className={sortOrder === 'a-z' ? 'active' : ''}
                            >
                                A-Z
                            </button>
                            <button
                                onClick={() => handleSortChange('z-a')}
                                className={sortOrder === 'z-a' ? 'active' : ''}
                            >
                                Z-A
                            </button>
                        </div>
                    </div>
                </div>

                <div className="main-content">
                    {/* Results */}
                    <div className={`results-${viewMode}`}>
                        {sortedResults().length === 0 ? (
                            <p>No results found. Try adjusting your filters.</p>
                        ) : (
                            sortedResults().map((result) =>
                                viewMode === 'grid' ? (
                                    <div
                                        className="result-card"
                                        key={result.id}
                                        onClick={() => handleCardClick(result.id)}
                                    >
                                        <img src={result.imageUrl} alt={result.name} />
                                        <p>{result.name}</p>
                                        <p>{result.category}</p>
                                    </div>
                                ) : (
                                    <div
                                        className="result-list-item"
                                        key={result.id}
                                        onClick={() => handleCardClick(result.id)}
                                    >
                                        <img
                                            className="results-list__image"
                                            src={result.imageUrl}
                                            alt={result.name}
                                        />
                                        <div className="result-details">
                                            <h4>{result.name}</h4>
                                            <p>{result.category}</p>
                                        </div>
                                    </div>
                                )
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
