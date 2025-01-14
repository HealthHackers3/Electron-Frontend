import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./UserPage.css";
import CellCard from "./CellCard";
import { fetchUserUsername, fetchUserDate, fetchUserEmail } from '../api/remote/userAPI';
import { fetchLikedPosts, fetchPostCoverImgID, fetchPostInfo } from '../api/remote/fetchpostAPI';

const UserPage = () => {
    const [profile, setProfile] = useState({
        username: "",
        memberSince: "",
        email: "",
    });

    const [likedPosts, setLikedPosts] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({ ...profile });

    const navigate = useNavigate();
    const location = useLocation(); // Import useLocation to get current path

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // Fetch all profile data in parallel
                const [username, memberSince, email, likedPostIds] = await Promise.all([
                    fetchUserUsername(),
                    fetchUserDate(),
                    fetchUserEmail(),
                    fetchLikedPosts(window.electron.getUserId()), // Assuming it returns an array of post IDs
                ]);

                console.log(likedPostIds);

                // Update profile state
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    username,
                    memberSince,
                    email,
                }));

                setEditedProfile((prevProfile) => ({
                    ...prevProfile,
                    username,
                    memberSince,
                    email,
                }));

                // Fetch details for each liked post ID
                const fetchPostDetails = async (postId) => {
                    const postInfo = await fetchPostInfo(postId);
                    const coverImgId = await fetchPostCoverImgID(postId);
                    return {
                        post_id: postId,
                        name: postInfo[0]?.post_name || "Unknown",
                        imageUrl: `https://bioeng-hhack-app.impaas.uk/api/img/thumbnail/${coverImgId}`,
                    };
                };

                const likedPostsData = await Promise.all(
                    likedPostIds.map((data) => fetchPostDetails(data.post_id))
                );

                console.log(likedPostsData);

                setLikedPosts(likedPostsData);
            } catch (error) {
                console.error("Error fetching profile or liked posts data:", error);
            }
        };

        fetchProfileData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile({ ...editedProfile, [name]: value });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        // Implement save logic, e.g., API call to update profile
        setProfile(editedProfile);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    const handleCardClick = (id) => {
        navigate(`/details/${id}`, {
            state: { post_id: id, parent: location.pathname },
        });
    };

    return (
        <div className="user-page">
            {/* Top display of username */}
            <h1>Hi, {profile.username}!</h1>
            <div className="profile-container">
                {/* Profile Section */}
                <div className="profile-info">
                    <div className="profile-header">
                        <h2>Profile</h2>
                    </div>
                    <div className="profile-fields">
                        <div>
                            <label>Username:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="username"
                                    value={editedProfile.username}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{profile.username}</span>
                            )}
                        </div>
                        <div>
                            <label>Member since:</label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    name="memberSince"
                                    value={editedProfile.memberSince}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{profile.memberSince}</span>
                            )}
                        </div>
                        <div>
                            <label>Email address:</label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={editedProfile.email}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{profile.email}</span>
                            )}
                        </div>
                    </div>
                    {isEditing && (
                        <div className="action-buttons">
                            <button onClick={handleSave} className="save-button">
                                Save
                            </button>
                            <button onClick={handleCancel} className="cancel-button">
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* Favourites Section */}
                <div className="favourites">
                    <h2>Favourites</h2>
                    {likedPosts.length > 0 ? (
                        <div className="favourites-grid">
                            {likedPosts.map((post) => (
                                <CellCard
                                    key={post.post_id}
                                    cell={post}
                                    onCardClick={handleCardClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <p>You have no favorite posts.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserPage;
