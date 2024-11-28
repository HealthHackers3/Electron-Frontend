import "./DetailsPage.css";
import React from "react";
import {useParams, useLocation, useNavigate} from "react-router-dom";

const DetailsPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const { imageUrl, properties } = location.state || {};

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `image_${properties?.category || "default"}_${id}.jpg`; // Dynamic file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const navigate = useNavigate(); // React Router hook for navigation

    const handleBackToHome = () => {
        navigate("/"); // Navigate to the home page
    };


    return (
        <div className="details-page">
            <div className="details-container">
                <div className="image-container">
                    {imageUrl ? (
                        <>
                            <img src={imageUrl} alt={`High-Resolution View of Item ${id}`}/>

                            {/* Download Image Button */}
                            <button onClick={handleDownload} className="download-image-button">
                                Download Image
                            </button>
                        </>
                    ) : (
                        <p>No image available</p>
                    )}
                </div>

                <div className="properties">
                    <h2>Properties</h2>
                    <ul>
                        <li><strong>Category:</strong> {properties?.category || "N/A"}</li>
                        <li><strong>Cell Type:</strong> {properties?.cellType || "N/A"}</li>
                        <li><strong>Cell Density:</strong> {properties?.cellDensity || "N/A"}</li>
                        <li><strong>Cell Width:</strong> {properties?.cellWidth || "N/A"} µm</li>
                        <li><strong>Cell Height:</strong> {properties?.cellHeight || "N/A"} µm</li>
                        <li><strong>Cell Area:</strong> {properties?.cellArea || "N/A"} µm²</li>
                        <li><strong>Cell Count:</strong> {properties?.cellCount || "N/A"}</li>
                        <li><strong>Image Modality:</strong> {properties?.imageModality || "N/A"}</li>
                        <li><strong>Author:</strong> {properties?.author || "Unknown"}</li>
                    </ul>
                </div>
            </div>

            <div className="back-icon" onClick={() => navigate("/")}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                >
                    <path d="M10 19l-7-7 7-7v4h8v6h-8v4z" />
                </svg>
                <span>Back to Search</span>
            </div>

        </div>
    );
};

export default DetailsPage;
