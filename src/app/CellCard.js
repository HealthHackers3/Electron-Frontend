// CellCard.jsx
// This component represents an individual card in the results grid,
// displaying information about a single cell (e.g., image, name, and category).
import React, { useState } from "react";
import "./CellCard.css"

// Define the CellCard component, which accepts 'cell' (cell data) and 'onCardClick' (callback for card click) as props.
const CellCard = ({ cell, onCardClick }) => {
    const [isLoading, setIsLoading] = useState(true); // State for managing the image loading state.
    const [hasError, setHasError] = useState(false);  // State for managing the error state (if the image fails to load).

    // Callback function to handle successful image load.
    const handleImageLoad = () => {
        setIsLoading(false); // Set loading state to false when the image loads successfully.
    };

    // Callback function to handle image loading errors.
    const handleImageError = () => {
        setIsLoading(false); // Stop loading since the image failed to load.
        setHasError(true); // Set error state to true.
    };

    // Render the CellCard component.
    return (
        <div
            className="results-grid__card"
            onClick={() => onCardClick(cell.id)}
        >
            <div className="results-grid__image-container">
                <img
                    src={cell.imageUrl}
                    alt={cell.name}
                    className={`results-grid__image ${!isLoading && !hasError ? "visible" : "hidden"}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                />
                {/* Display a placeholder if the image is still loading or if there is an error */}
                {(isLoading || hasError) && (
                    <div className={`image-placeholder ${isLoading ? "shimmer" : "error"}`}>
                        {/* Show "Image Not Available" if there's an error; otherwise, show the shimmer effect */}
                        {hasError ? "Image Not Available" : ""}
                    </div>
                )}
            </div>
            <p className="results-grid__name">{cell.name}</p>
            <p className="results-grid__category">{cell.category}</p>
        </div>
    );
};

export default CellCard;