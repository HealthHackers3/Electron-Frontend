import "./DetailsPage.css";
import React from "react";
import '@fortawesome/fontawesome-free/css/all.css';
import { useParams, useLocation, useNavigate } from "react-router-dom";

const DetailsPage = () => {
    const HeartIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="heart-icon"
        >
            <path
                d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z"
                ></path>
        </svg>
    );
    const {id} = useParams();
    const location = useLocation();
    const {imageUrl, properties, parent} = location.state || {};

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
                    <button className="btn-love">
                        <span className="fa fa-heart"></span>
                        <div className="small-ornament">
                            <div className="ornament o-1"></div>
                            <div className="ornament o-2"></div>
                            <div className="ornament o-3"></div>
                            <div className="ornament o-4"></div>
                            <div className="ornament o-5"></div>
                            <div className="ornament o-6"></div>
                        </div>
                        <div className="circle">
                            <svg>
                                <ellipse
                                    id="eclipse"
                                    rx="50"
                                    ry="50"
                                    cx="67.5"
                                    cy="67.5"
                                    fillOpacity="1"
                                    strokeLinecap=""
                                    strokeDashoffset=""
                                    fill="transparent"
                                    strokeDasharray=""
                                    strokeOpacity="1"
                                    strokeWidth="0"
                                    stroke="#988ADE"
                                ></ellipse>
                            </svg>
                        </div>
                    </button>

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
                    <path d="M10 19l-7-7 7-7v4h8v6h-8v4z"/>
                </svg>
                <span>Back</span>
            </div>
        </div>
    );
};

export default DetailsPage;
