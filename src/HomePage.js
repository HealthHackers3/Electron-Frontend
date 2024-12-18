import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
    const [randomCell, setRandomCell] = useState({});
    const [viewMode, setViewMode] = useState("grid");
    const [sortOrder, setSortOrder] = useState("newest");
    const [data, setData] = useState([]);

    const navigate = useNavigate();

    // Display a random cell of the week
    useEffect(() => {
        const fetchData = () => {
            const mockData = Array(56)
                .fill()
                .map((_, idx) => ({
                    id: idx,
                    name: `Cell ${idx + 1}`,
                    category: `Category ${idx % 5 + 1}`,
                    author: `Author ${idx % 10 + 1}`,
                    likes: Math.floor(Math.random() * 100),
                    imageUrl: `https://via.placeholder.com/150?text=Cell+${idx + 1}`,
                }));

            setData(mockData);

            // Check if 'randomCellOfWeek' is already stored and valid
            const storedCell = localStorage.getItem("randomCellOfWeek");
            const storedWeek = localStorage.getItem("randomCellWeek");

            // Get current week's start date (Monday midnight)
            const currentWeek = new Date();
            currentWeek.setHours(0, 0, 0, 0); // Reset time to midnight
            currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1); // Move to Monday

            const currentWeekString = currentWeek.toISOString();

            if (storedCell && storedWeek === currentWeekString) {
                setRandomCell(JSON.parse(storedCell)); // Use stored cell if valid
            } else {
                // Select a random cell and save it for the week
                const randomIndex = Math.floor(Math.random() * mockData.length);
                const chosenCell = mockData[randomIndex];

                localStorage.setItem("randomCellOfWeek", JSON.stringify(chosenCell));
                localStorage.setItem("randomCellWeek", currentWeekString);

                setRandomCell(chosenCell);
            }
        };

        fetchData();
    }, []);


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

        const imageUrl = `https://th.bing.com/th/id/R.479f9d7475e53ead9717a83c03f9da2f?rik=TX%2fqy%2fF%2fu5WdXg&pid=ImgRaw&r=0`;

        navigate(`/details/${id}`, {
            state: { imageUrl, properties },
        });
    };

    const handleViewChange = (mode) => {
        setViewMode(mode);
    };

    const handleSortChange = (order) => {
        setSortOrder(order);
    };

    const sortedResults = () => {
        const results = [...data];
        if (sortOrder === "newest") return results; // Default order
        if (sortOrder === "oldest") return results.reverse();
        if (sortOrder === "a-z") return results.sort((a, b) => a.name.localeCompare(b.name));
        if (sortOrder === "z-a") return results.sort((a, b) => b.name.localeCompare(a.name));
    };

    return (
        <div className="home-page">
            <div className="content">
                {/* Randomly Recommended Section */}
                <section className="featured-cell" onClick={() => handleCardClick(randomCell.id)}>
                    <div className="featured-image">
                        <img src={randomCell.imageUrl} alt={randomCell.name} />
                        <div className="image-info">
                            <h2>{randomCell.name}</h2>
                            <p>by {randomCell.author}</p>
                            <span>{randomCell.likes} likes</span>
                        </div>
                    </div>
                </section>

                {/* Sorting and View Mode Section */}
                <div className="controls">
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

                {/* Results Section */}
                {viewMode === "grid" && (
                    <div className="results-grid">
                        {sortedResults().map((result) => (
                            <div
                                className="result-card"
                                key={result.id}
                                onClick={() => handleCardClick(result.id)}
                            >
                                <div className="image-placeholder">
                                    <img src={result.imageUrl} alt={result.name} />
                                </div>
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

export default HomePage;
