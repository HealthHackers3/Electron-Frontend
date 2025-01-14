// CellCard.jsx
import React, { useState } from "react";
import "./CellCard.css";

const CellCard = ({ cell, onCardClick }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleImageError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    return (
        <div
            className="results-grid__card"
            onClick={() => onCardClick(cell.post_id)} // Use post_id instead of id
        >
            <div className="results-grid__image-container">
                {hasError || !cell.imageUrl ? (
                    <div className="image-placeholder">
                        Image Not Available
                    </div>
                ) : (
                    <img
                        src={cell.imageUrl}
                        alt={cell.name}
                        className="results-grid__image"
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        style={{ display: isLoading ? "none" : "block" }}
                    />
                )}
            </div>
            <p className="results-grid__name">{cell.name || "No Name"}</p>
        </div>
    );
};

export default CellCard;

