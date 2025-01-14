// SearchPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "./SearchPage.css";
import { searchPosts } from "../api/remote/searchAPI";
import { fetchImgInfo, fetchPostCoverImgID, fetchPostInfo } from "../api/remote/fetchpostAPI";
import CellCard from "./CellCard";
import {
    fetchCategories,
    fetchCellTypes,
    fetchImageModalities, // Ensure correct import
} from "../api/remote/postfieldsAPI"; // Import the CellCard component

const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Removed cellSize and selectedFileTypes from the filters state
    const [filters, setFilters] = useState({
        keywords: "",
        selectedTypes: [],
        selectedImageModality: [],
        cellCount: [0, 1000],
    });

    const [viewMode, setViewMode] = useState("grid");

    // Store unique IDs for filters based on results
    const [uniqueTypes, setUniqueTypes] = useState([]);
    const [uniqueImageModalities, setUniqueImageModalities] = useState([]);
    // Removed uniqueFileTypes

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const [lookupTables, setLookupTables] = useState({
        domainMap: {}, // Map of domain names to IDs
        cellTypeMap: {}, // Map of cell type names to IDs
        imageModalityMap: {}, // Map of image modality names to IDs
    });

    // Reverse lookup maps: ID to Name
    const [reverseLookup, setReverseLookup] = useState({
        domainIdToName: {},
        cellTypeIdToName: {},
        imageModalityIdToName: {},
    });

    // New state for cell count range and search status
    const [cellCountRange, setCellCountRange] = useState([0, 1000]);
    const [hasSearched, setHasSearched] = useState(false);

    // Ref to store the loading timeout
    const loadingTimeoutRef = useRef(null);

    // Function to look up ID by string
    const lookupId = (type, name) => {
        switch (type) {
            case "domain":
                return lookupTables.domainMap[name];
            case "cellType":
                return lookupTables.cellTypeMap[name];
            case "imageModality":
                return lookupTables.imageModalityMap[name];
            default:
                return null;
        }
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed((prev) => !prev);
    };

    useEffect(() => {
        const fetchOptionData = async () => {
            try {
                const [cellCategories, cellTypes, imageModalities] = await Promise.all([
                    fetchCategories(),
                    fetchCellTypes(),
                    fetchImageModalities(), // Corrected function name
                ]);

                // Create the lookup maps for names to IDs
                const domainMap = cellCategories.reduce((map, category) => {
                    map[category.category_name] = category.category_id;
                    return map;
                }, {});

                const cellTypeMap = cellTypes.reduce((map, cell) => {
                    map[cell.cell_type_name] = cell.cell_type_id;
                    return map;
                }, {});

                const imageModalityMap = imageModalities.reduce((map, image) => {
                    map[image.image_modality_name] = image.image_modality_id;
                    return map;
                }, {});

                // Create reverse lookup maps for IDs to names
                const domainIdToName = cellCategories.reduce((map, category) => {
                    map[category.category_id] = category.category_name;
                    return map;
                }, {});

                const cellTypeIdToName = cellTypes.reduce((map, cell) => {
                    map[cell.cell_type_id] = cell.cell_type_name;
                    return map;
                }, {});

                const imageModalityIdToName = imageModalities.reduce((map, image) => {
                    map[image.image_modality_id] = image.image_modality_name;
                    return map;
                }, {});

                setLookupTables({
                    domainMap,
                    cellTypeMap,
                    imageModalityMap,
                });

                setReverseLookup({
                    domainIdToName,
                    cellTypeIdToName,
                    imageModalityIdToName,
                });

                // Initially, no search has been performed, so no filter options are available
                setUniqueTypes([]);
                setUniqueImageModalities([]);
                // Removed uniqueFileTypes

                // Initially, no filters are selected except defaults
                setFilters((prevFilters) => ({
                    ...prevFilters,
                    selectedTypes: [],
                    selectedImageModality: [],
                }));
            } catch (error) {
                console.error("Error fetching filter options:", error);

                // Detailed error logging
                if (error.response) {
                    // Server responded with a status other than 2xx
                    console.error("Response data:", error.response.data);
                    console.error("Response status:", error.response.status);
                } else if (error.request) {
                    // Request was made but no response received
                    console.error("Request data:", error.request);
                } else {
                    // Something else caused the error
                    console.error("Error message:", error.message);
                }

                setError("Failed to load filter options. Please try again later.");
            }
        };

        fetchOptionData();
    }, []);

    useEffect(() => {
        if (location.state?.newEntry) {
            const newEntry = { ...location.state.newEntry, id: Date.now() };

            // Assuming newEntry.type, newEntry.imageModality, newEntry.fileType are names
            const typeId = lookupId("cellType", newEntry.type);
            const imageModalityId = lookupId("imageModality", newEntry.imageModality);
            const fileTypeId = lookupId("domain", newEntry.fileType);

            setResults((prevResults) => [...prevResults, newEntry]);

            // Update unique filters based on the new entry
            if (typeId) {
                setUniqueTypes((prevTypes) => [...new Set([...prevTypes, typeId])]);
            }

            if (imageModalityId) {
                const numericImageModalityId = Number(imageModalityId);
                setUniqueImageModalities((prevModalities) => [
                    ...new Set([...prevModalities, numericImageModalityId]),
                ]);
                setFilters((prevFilters) => ({
                    ...prevFilters,
                    selectedImageModality: [
                        ...new Set([
                            ...prevFilters.selectedImageModality,
                            numericImageModalityId,
                        ]),
                    ],
                }));
            }

            // Removed handling of fileTypeId

            // Automatically select the new filters
            setFilters((prevFilters) => ({
                ...prevFilters,
                selectedTypes: typeId
                    ? [...prevFilters.selectedTypes, typeId]
                    : prevFilters.selectedTypes,
                // selectedImageModality already handled above
            }));
        }
    }, [location.state, lookupId]);

    const handleCardClick = (id) => {
        navigate(`/details/${id}`);
    };

    const handleTypeChange = (typeId) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            selectedTypes: prevFilters.selectedTypes.includes(typeId)
                ? prevFilters.selectedTypes.filter((item) => item !== typeId)
                : [...prevFilters.selectedTypes, typeId],
        }));
    };

    const handleImageModalityChange = (imageModalityId) => {
        const id = Number(imageModalityId); // Ensure it's a number
        setFilters((prevFilters) => ({
            ...prevFilters,
            selectedImageModality: prevFilters.selectedImageModality.includes(id)
                ? prevFilters.selectedImageModality.filter((item) => item !== id)
                : [...prevFilters.selectedImageModality, id],
        }));
    };

    const handleViewChange = (mode) => {
        setViewMode(mode);
    };

    // Updated handleKeyDown function to update uniqueImageModalities based on search results with delay
    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            if (!filters.keywords.trim()) {
                return;
            }

            setHasSearched(true); // Indicate that a search has been performed
            setError(null);

            // Start a timeout to set loading to true after 300ms
            loadingTimeoutRef.current = setTimeout(() => {
                setLoading(true);
            }, 300);

            try {
                const searchResults = await searchPosts(filters.keywords);

                // Fetch detailed info and cover image for each post
                const detailedResults = await Promise.all(
                    searchResults.map(async (post) => {
                        const info = (await fetchPostInfo(post.post_id))[0];
                        const coverImgID = await fetchPostCoverImgID(post.post_id);
                        const image_info = (await fetchImgInfo(coverImgID))[0];
                        const imageUrl = coverImgID
                            ? `https://bioeng-hhack-app.impaas.uk/api/img/thumbnail/${coverImgID}`
                            : "";

                        return {
                            post_id: info.post_id,
                            name: info.post_name, // Map post_name to name
                            category_id: info.category_id, // Ensure category_id is included
                            imageUrl,
                            cell_type_id: Number(info.cell_type_id),
                            image_modality_id: Number(info.image_modality_id), // Ensure it's a number
                            cellCount: image_info.cell_count || 0, // Assuming cell_count is a field
                        };
                    })
                );

                setResults(detailedResults);

                // Compute unique filter options based on results
                const types = [...new Set(detailedResults.map((item) => item.cell_type_id))];
                const imageModalities = [
                    ...new Set(detailedResults.map((item) => item.image_modality_id)),
                ];

                setUniqueTypes(types);
                setUniqueImageModalities(imageModalities);

                // Compute min and max cell counts
                const cellCounts = detailedResults.map((item) => item.cellCount);
                const minCellCount = cellCounts.length > 0 ? Math.min(...cellCounts) : 0;
                const maxCellCount = cellCounts.length > 0 ? Math.max(...cellCounts) : 1000;

                setCellCountRange([minCellCount, maxCellCount]);

                // Set the cellCount filter to the new range
                setFilters((prevFilters) => ({
                    ...prevFilters,
                    selectedTypes: types,
                    selectedImageModality: imageModalities,
                    cellCount: [minCellCount, maxCellCount],
                }));

                // If there's only one cell type, auto-select and disable the checkbox
                if (types.length === 1) {
                    setFilters((prevFilters) => ({
                        ...prevFilters,
                        selectedTypes: types,
                    }));
                }

                // If there's only one image modality, auto-select and disable the checkbox
                if (imageModalities.length === 1) {
                    setFilters((prevFilters) => ({
                        ...prevFilters,
                        selectedImageModality: imageModalities,
                    }));
                }
            } catch (error) {
                console.error("Error during search:", error);

                // Detailed error logging
                if (error.response) {
                    // Server responded with a status other than 2xx
                    console.error("Response data:", error.response.data);
                    console.error("Response status:", error.response.status);
                } else if (error.request) {
                    // Request was made but no response received
                    console.error("Request data:", error.request);
                } else {
                    // Something else caused the error
                    console.error("Error message:", error.message);
                }

                setError("An error occurred while searching. Please try again.");
            } finally {
                // Clear the timeout
                if (loadingTimeoutRef.current) {
                    clearTimeout(loadingTimeoutRef.current);
                    loadingTimeoutRef.current = null;
                }

                // Ensure loading is set to false
                setLoading(false);
            }
        }
    };

    const filteredResults = () => {
        let filtered = Array.isArray(results) ? [...results] : [];

        // Apply additional filters
        if (filters.selectedTypes.length > 0) {
            filtered = filtered.filter((item) =>
                filters.selectedTypes.includes(item.cell_type_id)
            );
        }
        if (filters.selectedImageModality.length > 0) {
            filtered = filtered.filter((item) =>
                filters.selectedImageModality.includes(item.image_modality_id)
            );
        }
        if (filters.cellCount[0] > cellCountRange[0] || filters.cellCount[1] < cellCountRange[1]) {
            filtered = filtered.filter(
                (item) =>
                    item.cellCount >= filters.cellCount[0] &&
                    item.cellCount <= filters.cellCount[1]
            );
        }

        return filtered;
    };

    const ExpandIcon = (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.85719 3H15.1428C16.2266 2.99999 17.1007 2.99998 17.8086 3.05782C18.5375 3.11737 19.1777 3.24318 19.77 3.54497C20.7108 4.02433 21.4757 4.78924 21.955 5.73005C22.2568 6.32234 22.3826 6.96253 22.4422 7.69138C22.5 8.39925 22.5 9.27339 22.5 10.3572V13.6428C22.5 14.7266 22.5 15.6008 22.4422 16.3086C22.3826 17.0375 22.2568 17.6777 21.955 18.27C21.4757 19.2108 20.7108 19.9757 19.77 20.455C19.1777 20.7568 18.5375 20.8826 17.8086 20.9422C17.1008 21 16.2266 21 15.1428 21H8.85717C7.77339 21 6.89925 21 6.19138 20.9422C5.46253 20.8826 4.82234 20.7568 4.23005 20.455C3.28924 19.9757 2.52433 19.2108 2.04497 18.27C1.74318 17.6777 1.61737 17.0375 1.55782 16.3086C1.49998 15.6007 1.49999 14.7266 1.5 13.6428V10.3572C1.49999 9.27341 1.49998 8.39926 1.55782 7.69138C1.61737 6.96253 1.74318 6.32234 2.04497 5.73005C2.52433 4.78924 3.28924 4.02433 4.23005 3.54497C4.82234 3.24318 5.46253 3.11737 6.19138 3.05782C6.89926 2.99998 7.77341 2.99999 8.85719 3ZM6.35424 5.05118C5.74907 5.10062 5.40138 5.19279 5.13803 5.32698C4.57354 5.6146 4.1146 6.07354 3.82698 6.63803C3.69279 6.90138 3.60062 7.24907 3.55118 7.85424C3.50078 8.47108 3.5 9.26339 3.5 10.4V13.6C3.5 14.7366 3.50078 15.5289 3.55118 16.1458C3.60062 16.7509 3.69279 17.0986 3.82698 17.362C4.1146 17.9265 4.57354 18.3854 5.13803 18.673C5.40138 18.8072 5.74907 18.8994 6.35424 18.9488C6.97108 18.9992 7.76339 19 8.9 19H9.5V5H8.9C7.76339 5 6.97108 5.00078 6.35424 5.05118ZM11.5 5V19H15.1C16.2366 19 17.0289 18.9992 17.6458 18.9488C18.2509 18.8994 18.5986 18.8072 18.862 18.673C19.4265 18.3854 19.8854 17.9265 20.173 17.362C20.3072 17.0986 20.3994 16.7509 20.4488 16.1458C20.4992 15.5289 20.5 14.7366 20.5 13.6V10.4C20.5 9.26339 20.4992 8.47108 20.4488 7.85424C20.3994 7.24907 20.3072 6.90138 20.173 6.63803C19.8854 6.07354 19.4265 5.6146 18.862 5.32698C18.5986 5.19279 18.2509 5.10062 17.6458 5.05118C17.0289 5.00078 16.2366 5 15.1 5H11.5ZM5 8.5C5 7.94772 5.44772 7.5 6 7.5H7C7.55229 7.5 8 7.94772 8 8.5C8 9.05229 7.55229 9.5 7 9.5H6C5.44772 9.5 5 9.05229 5 8.5ZM5 12C5 11.4477 5.44772 11 6 11H7C7.55229 11 8 11.4477 8 12C8 12.5523 7.55229 13 7 13H6C5.44772 13 5 12.5523 5 12Z"
                fill="currentColor"
            ></path>
        </svg>
    );

    const CollapseIcon = ExpandIcon;

    return (
        <div className="search-page">
            {/* Sidebar */}
            <div className={`sidebar ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
                {/* Toggle Button */}
                <button className="toggle-button" onClick={toggleSidebar}>
                    {isSidebarCollapsed ? ExpandIcon : CollapseIcon}
                </button>

                {/* Existing Sidebar Content */}
                {!isSidebarCollapsed && (
                    <div className="filters">
                        {/* Cell Types */}
                        {uniqueTypes.length > 0 && (
                            <div className="filter-section">
                                <h3>Cell Types</h3>
                                {uniqueTypes.length > 1
                                    ? uniqueTypes.map((typeId) => (
                                        <label key={typeId} className="vertical-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={filters.selectedTypes.includes(typeId)}
                                                onChange={() => handleTypeChange(typeId)}
                                            />
                                            {reverseLookup.cellTypeIdToName[typeId] || "Unknown"}
                                        </label>
                                    ))
                                    : uniqueTypes.length === 1 && (
                                    <label className="vertical-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={filters.selectedTypes.includes(uniqueTypes[0])}
                                            disabled // Disable the checkbox since it's auto-selected
                                        />
                                        {reverseLookup.cellTypeIdToName[uniqueTypes[0]] || "Unknown"}
                                    </label>
                                )}
                            </div>
                        )}

                        {/* Image Modality with Multiple Options */}
                        {uniqueImageModalities.length > 1 && (
                            <div className="filter-section">
                                <h3>Image Modality</h3>
                                {uniqueImageModalities.map((imageModalityId) => (
                                    <label key={imageModalityId} className="vertical-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={filters.selectedImageModality.includes(imageModalityId)}
                                            onChange={() => handleImageModalityChange(imageModalityId)}
                                        />
                                        {reverseLookup.imageModalityIdToName[imageModalityId] || "Unknown"}
                                    </label>
                                ))}
                            </div>
                        )}

                        {/* Image Modality with Single Option */}
                        {uniqueImageModalities.length === 1 && (
                            <div className="filter-section">
                                <h3>Image Modality</h3>
                                <label className="vertical-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={filters.selectedImageModality.includes(uniqueImageModalities[0])}
                                        disabled // Make it read-only since it's auto-selected
                                    />
                                    {reverseLookup.imageModalityIdToName[uniqueImageModalities[0]] || "Unknown"}
                                </label>
                            </div>
                        )}

                        {/* Cell Count */}
                        {hasSearched && results.length > 0 && (
                            <div className="filter-section">
                                <h3>Cell Count</h3>
                                <div className="cell-count">
                                    <div className="range-display">
                                        <span>{filters.cellCount[0]}</span>
                                        <span>{filters.cellCount[1]}</span>
                                    </div>
                                    <Slider
                                        range
                                        min={cellCountRange[0]}
                                        max={cellCountRange[1]}
                                        value={filters.cellCount}
                                        onChange={(value) =>
                                            setFilters((prev) => ({ ...prev, cellCount: value }))
                                        }
                                    />
                                </div>
                            </div>
                        )}

                        {/* Message if No Filters Available */}
                        {uniqueTypes.length === 0 && uniqueImageModalities.length === 0 && (
                            <p>No available filters for the current results.</p>
                        )}
                    </div>
                )}
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
                            setFilters((prev) => ({ ...prev, keywords: e.target.value }))
                        }
                        onKeyDown={handleKeyDown}
                    />
                    <div className="header-actions">
                        <div className="view-options">
                            <button
                                onClick={() => handleViewChange("grid")}
                                className={viewMode === "grid" ? "active" : ""}
                            >
                                Grid
                            </button>
                            <button
                                onClick={() => handleViewChange("list")}
                                className={viewMode === "list" ? "active" : ""}
                            >
                                List
                            </button>
                        </div>
                    </div>
                </div>

                <div className="main-content">

                    {/* Error Message */}
                    {error && <p className="error-message">{error}</p>}

                    {/* Results */}
                    <div className={`results-${viewMode}`}>
                        {/* Loading Overlay */}
                        {loading && (
                            <div className="loading-overlay" role="alert" aria-busy="true">
                                <div className="spinner"></div>
                                <div className="loading-text">Loading...</div>
                            </div>
                        )}

                        {!loading && results.length === 0 && hasSearched ? (
                            <p>No results found.</p>
                        ) : (
                            !loading &&
                            filteredResults().map((result) => (
                                viewMode === "grid" ? (
                                    <CellCard
                                        key={result.post_id}
                                        cell={result}
                                        onCardClick={handleCardClick}
                                    />
                                ) : (
                                    <div
                                        className="result-list-item"
                                        key={result.post_id}
                                        onClick={() => handleCardClick(result.post_id)}
                                    >
                                        <img
                                            className="results-list__image"
                                            src={result.imageUrl}
                                            alt={result.name}
                                        />
                                        <div className="result-details">
                                            <h4 className="results-list__name">{result.name}</h4>
                                            {/* Display additional details if available */}
                                            <p>
                                                Cell Type: {reverseLookup.cellTypeIdToName[result.cell_type_id] || "Unknown"}
                                            </p>
                                            <p>
                                                Image Modality: {reverseLookup.imageModalityIdToName[result.image_modality_id] || "Unknown"}
                                            </p>
                                        </div>
                                    </div>
                                )
                            ))
                        )}
                        {!loading && results.length === 0 && !hasSearched && (
                            <p>No results found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
