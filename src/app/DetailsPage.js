import "./DetailsPage.css";
import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const DetailsPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const { imageUrl, properties, parent } = location.state || {};

    const handleDownload = async () => {
        try {
            // Fetch the image as a blob
            const response = await fetch(imageUrl);
            const blob = await response.blob();

            // Create an object URL for the blob
            const blobUrl = URL.createObjectURL(blob);

            // Create a link and trigger the download
            const link = document.createElement("a");
            link.href = blobUrl;

            // Generate a dynamic file name
            const fileName = `image_${properties?.category || "default"}_${id}.jpg`;
            link.download = fileName;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Revoke the object URL after download
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Error downloading image:", error);
        }
    };

    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate(parent || "/"); // Navigate to the home page
    };

    return (
        <div className="details-page">
            <div className="details-container">
                <div className="image-container">
                    {imageUrl ? (
                        <>
                            <img src={imageUrl} alt={`High-Resolution View of Item ${id}`} />

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
                        <li><strong>Name:</strong> {properties?.name || "N/A"}</li>
                        <li><strong>Category:</strong> {properties?.category || "N/A"}</li>
                        <li><strong>Cell Type:</strong> {properties?.cellType || "N/A"}</li>
                        <li><strong>Cell Density:</strong> {properties?.cellDensity || "N/A"}</li>
                        <li><strong>Cell Width:</strong> {properties?.cellWidth || "N/A"} µm</li>
                        <li><strong>Cell Height:</strong> {properties?.cellHeight || "N/A"} µm</li>
                        <li><strong>Cell Area:</strong> {properties?.cellArea || "N/A"} µm²</li>
                        <li><strong>Cell Count:</strong> {properties?.cellCount || "N/A"}</li>
                        <li><strong>Image Modality:</strong> {properties?.imageModality || "N/A"}</li>
                        <li><strong>Shape:</strong> {properties?.shape || "N/A"}</li>
                        <li><strong>Author:</strong> {properties?.author || "Unknown"}</li>
                        <li><strong>Date:</strong> {properties?.date || "N/A"}</li>
                        <li><strong>Comments:</strong> {properties?.comments || "N/A"}</li>
                        <li><strong>Tags:</strong> {properties?.tags || "N/A"}</li>
                        <li><strong>Likes:</strong> {properties?.likes || "N/A"}</li>
                    </ul>
                </div>
            </div>

            <div className="back-icon" onClick={handleBackToHome}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                >
                    <path d="M10 19l-7-7 7-7v4h8v6h-8v4z" />
                </svg>
                <span>Back</span>
            </div>
        </div>
    );
};

export default DetailsPage;
