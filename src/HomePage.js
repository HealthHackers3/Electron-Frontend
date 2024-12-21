// HomePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import CellCard from "./CellCard"; // Import the CellCards component

const HomePage = () => {
    const [randomCell, setRandomCell] = useState({});
    const [viewMode, setViewMode] = useState("grid");
    const [sortOrder, setSortOrder] = useState("newest");
    const [cellsData, setCellsData] = useState([]);

    const navigate = useNavigate();

    // Display a random cell of the week
    useEffect(() => {
        const fetchCells = () => {
            const mockData = Array(56)
                .fill()
                .map((_, idx) => ({
                    id: idx,
                    name: `Cell ${idx + 1}`,
                    category: `Category ${idx % 5 + 1}`,
                    author: `Author ${idx % 10 + 1}`,
                    likes: Math.floor(Math.random() * 100),
                    imageUrl: `https://www.visiblebody.com/hubfs/learn/bio/assets/cells/cell-overview`
                }));

            setCellsData(mockData);

            // Check if 'randomCellOfWeek' is already stored and valid
            const storedRandomCell = localStorage.getItem("random-cell-of-week");
            const storedRandomCellWeek = localStorage.getItem("random-cell-week");

            // Get current week's start date (Monday midnight)
            const currentWeek = new Date();
            currentWeek.setHours(0, 0, 0, 0); // Reset time to midnight
            currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + 1); // Move to Monday

            const currentWeekString = currentWeek.toISOString();

            if (storedRandomCell && storedRandomCellWeek === currentWeekString) {
                setRandomCell(JSON.parse(storedRandomCell)); // Use stored cell if valid
            } else {
                // Select a random cell and save it for the week
                const randomIndex = Math.floor(Math.random() * mockData.length);
                const selectedCell = mockData[randomIndex];

                localStorage.setItem("random-cell-of-week", JSON.stringify(selectedCell));
                localStorage.setItem("random-cell-week", currentWeekString);

                setRandomCell(selectedCell);
            }
        };

        fetchCells();
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

    const getSortedCells = () => {
        const sorted = [...cellsData];
        switch (sortOrder) {
            case "oldest":
                return sorted.reverse();
            case "a-z":
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case "z-a":
                return sorted.sort((a, b) => b.name.localeCompare(a.name));
            case "newest":
            default:
                return sorted; // Default order
        }
    };

    return (
        <div className="home-page">
            <div className="home-page__content">
                {/* Randomly Recommended Section */}
                <section
                    className="home-page__featured-cell"
                    onClick={() => handleCardClick(randomCell.id)}
                >
                    <div className="featured-cell__image">
                        <img src={randomCell.imageUrl} alt={randomCell.name} />
                        <div className="featured-cell__info">
                            <h2>{randomCell.name}</h2>
                            <p>by {randomCell.author}</p>
                            <span>{randomCell.likes} likes</span>
                        </div>
                    </div>
                </section>

                {/* Sorting and View Mode Section */}
                <div className="home-page__controls">
                    <div className="controls__view-options">
                        <button
                            onClick={() => handleViewChange("grid")}
                            className={`controls__button ${viewMode === "grid" ? "controls__button--active" : ""}`}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => handleViewChange("table")}
                            className={`controls__button ${viewMode === "table" ? "controls__button--active" : ""}`}
                        >
                            Table
                        </button>
                        <button
                            onClick={() => handleViewChange("list")}
                            className={`controls__button ${viewMode === "list" ? "controls__button--active" : ""}`}
                        >
                            List
                        </button>
                    </div>
                    <div className="controls__sort-options">
                        <button
                            onClick={() => handleSortChange("newest")}
                            className={`controls__button ${sortOrder === "newest" ? "controls__button--active" : ""}`}
                        >
                            Newest
                        </button>
                        <button
                            onClick={() => handleSortChange("oldest")}
                            className={`controls__button ${sortOrder === "oldest" ? "controls__button--active" : ""}`}
                        >
                            Oldest
                        </button>
                        <button
                            onClick={() => handleSortChange("a-z")}
                            className={`controls__button ${sortOrder === "a-z" ? "controls__button--active" : ""}`}
                        >
                            A-Z
                        </button>
                        <button
                            onClick={() => handleSortChange("z-a")}
                            className={`controls__button ${sortOrder === "z-a" ? "controls__button--active" : ""}`}
                        >
                            Z-A
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                {viewMode === "grid" && (
                    <div className="home-page__results-grid">
                        {getSortedCells().map((cell) => (
                            <CellCard key={cell.id} cell={cell} onCardClick={handleCardClick} />
                        ))}
                    </div>
                )}

                {viewMode === "table" && (
                    <div className="home-page__results-table">
                        <table className="results-table">
                            <thead>
                            <tr>
                                <th className="results-table__header">Name</th>
                                <th className="results-table__header">Category</th>
                                <th className="results-table__header">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {getSortedCells().map((cell) => (
                                <tr key={cell.id} className="results-table__row">
                                    <td className="results-table__cell">{cell.name}</td>
                                    <td className="results-table__cell">{cell.category}</td>
                                    <td className="results-table__cell">
                                        <button
                                            className="results-table__button"
                                            onClick={() => handleCardClick(cell.id)}
                                        >
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
                    <div className="home-page__results-list">
                        {getSortedCells().map((cell) => (
                            <div
                                className="results-list__item"
                                key={cell.id}
                                onClick={() => handleCardClick(cell.id)}
                            >
                                <div className="results-list__content">
                                    <h4 className="results-list__name">{cell.name}</h4>
                                    <p className="results-list__category">{cell.category}</p>
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
