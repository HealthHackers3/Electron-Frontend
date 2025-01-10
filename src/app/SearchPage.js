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
        selectedDomains: [],
        selectedTypes: [],
        selectedImageModality: [],
        selectedFileTypes: [],
        cellSize: [0, 1000],
        cellCount: [0, 1000],
    });

    const resetFilters = () => {
        setFilters({
            keywords: "",
            selectedDomains: [],
            selectedTypes: [],
            selectedImageModality: [],
            selectedFileTypes: [],
            cellSize: [0, 1000],
            cellCount: [0, 1000],
        });
    };

    const [viewMode, setViewMode] = useState("grid"); // Default view mode
    const [sortOrder, setSortOrder] = useState("newest"); // Default sorting order
    const [data, setData] = useState([]); // Mock database
    const [uniqueDomains, setUniqueDomains] = useState([]);
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

                // Update unique domains, types, and other properties
                setUniqueDomains((prevDomains) => [
                    ...new Set([...prevDomains, newEntry.domain]),
                ]);
                setUniqueTypes((prevTypes) => [
                    ...new Set([...prevTypes, newEntry.type]),
                ]);
                setUniqueImageModalities((prevModalities) => [
                    ...new Set([...prevModalities, newEntry.imageModality]),
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

    const handleDomainChange = (domain) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            selectedDomains: prevFilters.selectedDomains.includes(domain)
                ? prevFilters.selectedDomains.filter((item) => item !== domain)
                : [...prevFilters.selectedDomains, domain],
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
        if (filters.selectedDomains.length > 0) {
            results = results.filter((item) => filters.selectedDomains.includes(item.domain));
        }
        if (filters.selectedTypes.length > 0) {
            results = results.filter((item) => filters.selectedTypes.includes(item.type));
        }
        if (filters.selectedImageModality.length > 0) {
            results = results.filter((item) => filters.selectedImageModality.includes(item.imageModality));
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
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd"
                  d="M8.85719 3H15.1428C16.2266 2.99999 17.1007 2.99998 17.8086 3.05782C18.5375 3.11737 19.1777 3.24318 19.77 3.54497C20.7108 4.02433 21.4757 4.78924 21.955 5.73005C22.2568 6.32234 22.3826 6.96253 22.4422 7.69138C22.5 8.39925 22.5 9.27339 22.5 10.3572V13.6428C22.5 14.7266 22.5 15.6008 22.4422 16.3086C22.3826 17.0375 22.2568 17.6777 21.955 18.27C21.4757 19.2108 20.7108 19.9757 19.77 20.455C19.1777 20.7568 18.5375 20.8826 17.8086 20.9422C17.1008 21 16.2266 21 15.1428 21H8.85717C7.77339 21 6.89925 21 6.19138 20.9422C5.46253 20.8826 4.82234 20.7568 4.23005 20.455C3.28924 19.9757 2.52433 19.2108 2.04497 18.27C1.74318 17.6777 1.61737 17.0375 1.55782 16.3086C1.49998 15.6007 1.49999 14.7266 1.5 13.6428V10.3572C1.49999 9.27341 1.49998 8.39926 1.55782 7.69138C1.61737 6.96253 1.74318 6.32234 2.04497 5.73005C2.52433 4.78924 3.28924 4.02433 4.23005 3.54497C4.82234 3.24318 5.46253 3.11737 6.19138 3.05782C6.89926 2.99998 7.77341 2.99999 8.85719 3ZM6.35424 5.05118C5.74907 5.10062 5.40138 5.19279 5.13803 5.32698C4.57354 5.6146 4.1146 6.07354 3.82698 6.63803C3.69279 6.90138 3.60062 7.24907 3.55118 7.85424C3.50078 8.47108 3.5 9.26339 3.5 10.4V13.6C3.5 14.7366 3.50078 15.5289 3.55118 16.1458C3.60062 16.7509 3.69279 17.0986 3.82698 17.362C4.1146 17.9265 4.57354 18.3854 5.13803 18.673C5.40138 18.8072 5.74907 18.8994 6.35424 18.9488C6.97108 18.9992 7.76339 19 8.9 19H9.5V5H8.9C7.76339 5 6.97108 5.00078 6.35424 5.05118ZM11.5 5V19H15.1C16.2366 19 17.0289 18.9992 17.6458 18.9488C18.2509 18.8994 18.5986 18.8072 18.862 18.673C19.4265 18.3854 19.8854 17.9265 20.173 17.362C20.3072 17.0986 20.3994 16.7509 20.4488 16.1458C20.4992 15.5289 20.5 14.7366 20.5 13.6V10.4C20.5 9.26339 20.4992 8.47108 20.4488 7.85424C20.3994 7.24907 20.3072 6.90138 20.173 6.63803C19.8854 6.07354 19.4265 5.6146 18.862 5.32698C18.5986 5.19279 18.2509 5.10062 17.6458 5.05118C17.0289 5.00078 16.2366 5 15.1 5H11.5ZM5 8.5C5 7.94772 5.44772 7.5 6 7.5H7C7.55229 7.5 8 7.94772 8 8.5C8 9.05229 7.55229 9.5 7 9.5H6C5.44772 9.5 5 9.05229 5 8.5ZM5 12C5 11.4477 5.44772 11 6 11H7C7.55229 11 8 11.4477 8 12C8 12.5523 7.55229 13 7 13H6C5.44772 13 5 12.5523 5 12Z"
                  fill="currentColor"></path>
        </svg>
    );

    const CollapseIcon = ExpandIcon;

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
                    {/* Domains */}
                    <div className="filter-section">
                        <h3>Domains</h3>
                        {uniqueDomains.map((domain) => (
                            <label key={domain} className="vertical-checkbox">
                                <input
                                    type="checkbox"
                                    checked={filters.selectedDomains.includes(domain)}
                                    onChange={() => handleDomainChange(domain)}
                                />
                                {domain}
                            </label>
                        ))}
                    </div>
                    {/* Types */}
                    <div className="filter-section">
                        <h3>Cell Types</h3>
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
                    {/* Cell Count */}
                    <div className="filter-section">
                        <h3>Cell Count</h3>
                        <div className="cell-count">
                            <div className="range-display">
                                <span>{filters.cellCount[0]}</span>
                                <span>{filters.cellCount[1]}</span>
                            </div>
                            <Slider
                                range
                                min={0}
                                max={1000}
                                value={filters.cellCount}
                                onChange={(value) => setFilters({...filters, cellCount: value})}
                            />
                        </div>
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
                                        <p>{result.domain}</p>
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
                                            <p>{result.domain}</p>
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

