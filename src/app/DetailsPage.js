import React, { useRef, useState } from "react";
import "./DetailsPage.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { gsap } from "gsap";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const DetailsPage = () => {
    const [likeCount, setLikeCount] = useState(100); // Dummy like count
    const btnLoveRef = useRef(null);
    const { id } = useParams();
    const location = useLocation();
    const { imageUrl, properties, parent } = location.state || {};

    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            const fileName = `image_${properties?.category || "default"}_${id}.jpg`;
            link.download = fileName;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Error downloading image:", error);
        }
    };

    const navigate = useNavigate();

    const handleBackToHome = () => {
        navigate(parent || "/");
    };

    const handleLikeButton = () => {
        const btnLove = btnLoveRef.current;

        if (!btnLove.classList.contains("act")) {
            btnLove.classList.add("act");
            setLikeCount((prev) => prev + 1); // Increment like count

            // Reset animations
            gsap.set(".circle, .small-ornament", { rotation: 0, scale: 0 });
            gsap.set(".ornament", { opacity: 0, scale: 1 });

            const tl = gsap.timeline();
            tl.to(".fa", { scale: 0, duration: 0.1, ease: "none" })
                .to(".circle", { scale: 1.2, opacity: 1, duration: 0.2, ease: "none" })
                .to(".fa", { scale: 1.3, color: "#e3274d", duration: 0.2, ease: "power1.out" })
                .to(".fa", { scale: 1, duration: 0.2, ease: "power1.out" });
        } else {
            btnLove.classList.remove("act");
            setLikeCount((prev) => (prev > 0 ? prev - 1 : 0)); // Decrement like count
            gsap.set(".fa", { color: "#c0c1c3" });
        }
    };

    return (
        <div className="details-page">
            <div className="details-container">
                <div className="image-container">
                    {imageUrl ? (
                        <>
                            <img src={imageUrl} alt={`High-Resolution View of Item ${id}`} />
                            <button onClick={handleDownload} className="download-image-button">
                                Download Image
                            </button>
                        </>
                    ) : (
                        <p>No image available</p>
                    )}
                </div>

                <div className="properties">
                    <button className="btn-love" ref={btnLoveRef} onClick={handleLikeButton}>
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
                    <div className="like-count">{likeCount}</div>
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
