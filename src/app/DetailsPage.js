import React, { useRef, useState, useEffect } from "react";
import "./DetailsPage.css";
import "@fortawesome/fontawesome-free/css/all.css";
import { gsap } from "gsap";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchPostImages, fetchPostInfo, fetchImgInfo } from "../api/remote/fetchpostAPI";
import { addLike, removeLike, getLikeStatus } from "../api/remote/likeAPI";
import { fetchCellTypes, fetchImageModalities } from "../api/remote/postfieldsAPI";
import { fetchUserUsername } from "../api/remote/userAPI";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const DetailsPage = () => {
    const [likeCount, setLikeCount] = useState(null);
    const [isLiked, setIsLiked] = useState(null);
    const [imageIds, setImageIds] = useState([]);
    const [postDetails, setPostDetails] = useState({});
    const [cellCount, setCellCount] = useState(null);
    const [cellTypeMap, setCellTypeMap] = useState({});
    const [imageModalityMap, setImageModalityMap] = useState({});
    const [authorUsername, setAuthorUsername] = useState("Unknown");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const btnLoveRef = useRef(null);
    const location = useLocation();
    const { post_id } = location.state || {};
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [cellTypes, imageModalities] = await Promise.all([
                    fetchCellTypes(),
                    fetchImageModalities(),
                ]);

                const cellTypeMap = cellTypes.reduce((map, item) => {
                    map[item.cell_type_id] = item.cell_type_name;
                    return map;
                }, {});

                const imageModalityMap = imageModalities.reduce((map, item) => {
                    map[item.image_modality_id] = item.image_modality_name;
                    return map;
                }, {});

                setCellTypeMap(cellTypeMap);
                setImageModalityMap(imageModalityMap);

                const postInfo = await fetchPostInfo(post_id);
                const post = postInfo[0];
                const username = await fetchUserUsername(post.poster_id);
                const ids = await fetchPostImages(post_id);

                let cellCount = null;
                if (ids.length > 0) {
                    const imgInfo = await fetchImgInfo(ids[0]);
                    cellCount = imgInfo[0]?.cell_count || null;
                }

                setPostDetails(post);
                setCellCount(cellCount);
                setImageIds(ids);
                setAuthorUsername(username);
                setIsLiked(await getLikeStatus(post_id));
                setLikeCount(post.likes);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching details:", err);
                setError("Failed to load post details.");
                setLoading(false);
            }
        };

        fetchDetails();
    }, [post_id]);

    const handleLikeButton = async () => {
        const btnLove = btnLoveRef.current;

        if (!btnLove) return;

        if (!isLiked) {
            btnLove.classList.add("act");
            setLikeCount((prev) => prev + 1);
            setIsLiked(true);
            await addLike(post_id);
        } else {
            btnLove.classList.remove("act");
            setLikeCount((prev) => Math.max(0, prev - 1));
            setIsLiked(false);
            await removeLike(post_id);
        }
    };

    const handleDownloadAll = async () => {
        try {
            const zip = new JSZip();
            const folder = zip.folder("images");
            if (!folder) throw new Error("Failed to create ZIP folder.");

            await Promise.all(
                imageIds.map(async (id) => {
                    try {
                        const response = await fetch(`https://bioeng-hhack-app.impaas.uk/api/img/fullres/${id}`);
                        if (!response.ok) throw new Error(`Failed to fetch image ${id}`);
                        const blob = await response.blob();
                        folder.file(`image_${id}.jpg`, blob);
                    } catch (imgError) {
                        console.error(`Error fetching or adding image ${id}:`, imgError);
                    }
                })
            );

            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, `images_post_${post_id}.zip`);
        } catch (err) {
            console.error("Error downloading images:", err);
            alert("Failed to download images. Please try again later.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="details-page">
            <div className="details-container">
                <div className="like-section">
                    <button
                        className={`btn-love ${isLiked ? "act" : ""}`}
                        ref={btnLoveRef}
                        onClick={handleLikeButton}
                    >
                        <span className="fa fa-heart"></span>
                    </button>
                    <span className="like-count">{likeCount} Likes</span>
                </div>
                <div className="properties">
                    <h2>Properties</h2>
                    <ul>
                        <li><strong>Cell Type:</strong> {cellTypeMap[postDetails.cell_type_id] || "N/A"}</li>
                        <li><strong>Cell Count:</strong> {cellCount || "N/A"}</li>
                        <li><strong>Image Modality:</strong> {imageModalityMap[postDetails.image_modality_id] || "N/A"}</li>
                        <li><strong>Author:</strong> {authorUsername}</li>
                        <li><strong>Upload Date:</strong> {postDetails.upload_date || "Unknown"}</li>
                    </ul>
                </div>
                <div className="image-gallery">
                    <h2>Images</h2>
                    <div className="image-grid">
                        {imageIds.length > 0 ? (
                            imageIds.map((id) => (
                                <img
                                    key={id}
                                    src={`https://bioeng-hhack-app.impaas.uk/api/img/thumbnail/${id}`}
                                    alt={`Thumbnail for Image ${id}`}
                                    className="thumbnail-image"
                                />
                            ))
                        ) : (
                            <p>No images available.</p>
                        )}
                    </div>
                    {imageIds.length > 0 && (
                        <button onClick={handleDownloadAll} className="download-all-button">
                            Download All Images
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;
