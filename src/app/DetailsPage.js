// DetailsPage.jsx
import React, { useRef, useState, useEffect } from "react";
import "./DetailsPage.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { gsap } from "gsap";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchPostImages, fetchPostInfo, fetchLikedPosts } from "../api/remote/fetchpostAPI"; // Adjust the import path as necessary
import {addLike, removeLike, getLikeStatus} from "../api/remote/likeAPI";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const DetailsPage = () => {
    const [likeCount, setLikeCount] = useState(null); // Dummy like count
    const [isLiked, setIsLiked] = useState(null); // Initially liked
    const [imageIds, setImageIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const btnLoveRef = useRef(null);
    const location = useLocation();
    const { post_id, parent } = location.state || {};
    const navigate = useNavigate();

    // Fetch image IDs when component mounts
    useEffect(() => {
        const getImageIds = async () => {
            try {
                const ids = await fetchPostImages(post_id);
                setImageIds(ids);
                setIsLiked((await getLikeStatus(post_id)))
                setLikeCount((await fetchPostInfo(post_id))[0].likes)
                setLoading(false);
            } catch (err) {
                console.error("Error fetching image IDs:", err);
                setError("Failed to load images.");
                setLoading(false);
            }
        };

        getImageIds();
    }, [post_id]);

    const handleDownloadAll = async () => {
        if (imageIds.length === 0) {
            alert("No images to download.");
            return;
        }

        const zip = new JSZip();
        const folder = zip.folder("images");

        try {
            const fetchPromises = imageIds.map(async (id) => {
                const response = await fetch(`https://bioeng-hhack-app.impaas.uk/api/img/fullres/${id}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch image with ID: ${id}`);
                }
                const blob = await response.blob();
                folder.file(`image_${id}.jpg`, blob);
            });

            await Promise.all(fetchPromises);

            const content = await zip.generateAsync({ type: "blob" });

            saveAs(content, `images_post_${post_id}.zip`);
        } catch (err) {
            console.error("Error downloading images:", err);
        }
    };

    const handleBackToHome = () => {
        navigate(parent || "/");
    };

    const handleLikeButton = async () => {
        const btnLove = btnLoveRef.current;

        if (!btnLove) {
            console.warn("Button reference is null");
            return;
        }

        if (!isLiked) {
            btnLove.classList.add("act");
            setLikeCount((prev) => prev + 1);
            setIsLiked(true);
            await addLike(post_id);

            gsap.set(".circle, .small-ornament", {rotation: 0, scale: 0});
            gsap.set(".ornament", {opacity: 0, scale: 1});

            const tl = gsap.timeline();
            tl.to(".fa", {scale: 0, duration: 0.1, ease: "none"})
                .to(".circle", {scale: 1.2, opacity: 1, duration: 0.2, ease: "none"})
                .to(".fa", {scale: 1.3, color: "#e3274d", duration: 0.2, ease: "power1.out"})
                .to(".fa", {scale: 1, duration: 0.2, ease: "power1.out"});
        } else {
            btnLove.classList.remove("act");
            setLikeCount((prev) => (prev > 0 ? prev - 1 : 0));
            setIsLiked(false);
            removeLike(post_id)
            gsap.set(".fa", {color: "#c0c1c3"});
        }
    };

    useEffect(() => {
        const btnLove = btnLoveRef.current;
        if (btnLove && isLiked) {
            btnLove.classList.add("act");
        }
    }, [isLiked]);

    if (loading) {
        return (
            <div className="details-page">
                <p>Loading images...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="details-page">
                <p>{error}</p>
                <div className="back-icon" onClick={handleBackToHome}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M10 19l-7-7 7-7v4h8v6h-8v4z" />
                    </svg>
                    <span>Back</span>
                </div>
            </div>
        );
    }

    return (
        <div className="details-page">
            <div className="details-container">
                <div className="image-container">
                    {imageIds.length > 0 ? (
                        <div className="thumbnails-grid">
                            {imageIds.map((id) => (
                                <div key={id} className="thumbnail-wrapper">
                                    <img
                                        src={`https://bioeng-hhack-app.impaas.uk/api/img/thumbnail/${id}`}
                                        alt={`Thumbnail of Image ${id}`}
                                        className="thumbnail-image"
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No images available</p>
                    )}
                    {imageIds.length > 0 && (
                        <button onClick={handleDownloadAll} className="download-all-button">
                            Download All Images
                        </button>
                    )}
                </div>

                <div className="properties">
                    <button
                        className={`btn-love ${isLiked ? "act" : ""}`}
                        ref={btnLoveRef}
                        onClick={handleLikeButton}
                    >
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
                        <li><strong>Category:</strong> N/A</li>
                        <li><strong>Cell Type:</strong> N/A</li>
                        <li><strong>Cell Density:</strong> N/A</li>
                        <li><strong>Cell Width:</strong> N/A µm</li>
                        <li><strong>Cell Height:</strong> N/A µm</li>
                        <li><strong>Cell Area:</strong> N/A µm²</li>
                        <li><strong>Cell Count:</strong> N/A</li>
                        <li><strong>Image Modality:</strong> N/A</li>
                        <li><strong>Author:</strong> Unknown</li>
                    </ul>
                </div>
            </div>

            <div className="back-icon" onClick={handleBackToHome}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M10 19l-7-7 7-7v4h8v6h-8v4z" />
                </svg>
                <span>Back</span>
            </div>
        </div>
    );
};

export default DetailsPage;
