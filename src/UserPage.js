import React, { useState } from "react";
import "./UserPage.css";

const UserPage = () => {
    const [profile, setProfile] = useState({
        username: "Username", // 默认用户名
        memberSince: "2023-01-01", // 默认日期
        email: "username@imperial.ac.uk",
        institute: "Imperial College London",
        department: "Bioengineering",
        uploadedImages: Array(6).fill(""), // Placeholder for uploaded images
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({ ...profile });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile({ ...editedProfile, [name]: value });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setProfile(editedProfile);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedProfile(profile);
        setIsEditing(false);
    };

    return (
        <div className="user-page">
            {/* 顶部显示用户名 */}
            <h1>{profile.username}</h1>
            <div className="profile-container">
                {/* Profile Section */}
                <div className="profile-info">
                    <div className="profile-header">
                        <h2>Profile</h2>
                        {!isEditing && (
                            <button onClick={handleEdit} className="edit-button">
                                ✏️ Edit
                            </button>
                        )}
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
                        <div>
                            <label>Institute:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="institute"
                                    value={editedProfile.institute}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{profile.institute}</span>
                            )}
                        </div>
                        <div>
                            <label>Department:</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="department"
                                    value={editedProfile.department}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <span>{profile.department}</span>
                            )}
                        </div>
                        <div>
                            <label>No. images uploaded:</label>
                            <span>
                                {profile.uploadedImages.length} (<a href="#">see here</a>)
                            </span>
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
                    <div className="favourites-grid">
                        {profile.uploadedImages.map((image, idx) => (
                            <div className="favourite-card" key={idx}>
                                <div className="image-placeholder">
                                    {image || `Cell ${idx + 1}`}
                                </div>
                                <p>Cell {idx + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPage;
