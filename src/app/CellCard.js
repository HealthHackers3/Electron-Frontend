// CellCard.jsx
import React, { useState } from "react";
import "./CellCard.css"

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
                {(isLoading || hasError) && (
                    <div className={`image-placeholder ${isLoading ? "shimmer" : "error"}`}>
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