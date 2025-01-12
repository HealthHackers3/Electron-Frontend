import React, { useState, useRef } from "react";
import "./FileDrop.css";

// FileDrop component for handling file uploads
const FileDrop = ({ onFilesAdded, uploadedImages, handleImageRemove }) => {
    const [isDragging, setIsDragging] = useState(false); // State to track drag-drop events
    const [failedImages, setFailedImages] = useState([]); // State to track failed image loads
    const fileInputRef = useRef(null); // Reference to the hidden file input element

    // Handling files drag over the drop area
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    // Handling files drag leave the drop area
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    // Handling files drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const { files } = e.dataTransfer;
        if (files && files.length > 0) {
            onFilesAdded(Array.from(files));
        }
    };

    // Handle click of the drop area to open file picker
    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handle file picker
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onFilesAdded(Array.from(e.target.files));
        }
    };

    // Handle image load error
    const handleImageError = (imageUrl) => {
        if (!failedImages.includes(imageUrl)) {
            setFailedImages(prev => [...prev, imageUrl]);
        }
    };

    return (
        <div
            className={`file-drop-container ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
        >
            {/* Hidden input to catch file picker */}
            <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden-file-input"
                accept="image/*"
            />

            {/* Content displayed inside the file drop area */}
            <div className="file-drop-content">
                {isDragging ? (
                    <>
                        {/* Displayed when dragging over the drop area */}
                        <div className="file-drop-icon">&#128230;</div>
                        <p>Drop files here, or click to browse</p>
                    </>
                ) : (
                    <>
                        {/* Displayed when no drag event */}
                        <div className="file-drop-icon">&#128230;</div>
                        <p>Drop files here, or click to browse</p>
                    </>
                )}
            </div>

            {/* Display uploaded image thumbnails */}
            {uploadedImages.length > 0 && (
                <div className="uploaded-images">
                    {uploadedImages.map((image, index) => (
                        <div className="uploaded-image" key={index}>
                            {!failedImages.includes(image) ? (
                                <img
                                    src={image}
                                    alt={`Uploaded ${index + 1}`}
                                    onError={() => handleImageError(image)}
                                />
                            ) : (
                                <div className="unsupported-image-placeholder">
                                    <span>Format not supported<br />to preview</span>
                                </div>
                            )}
                            {/* Button to remove the image */}
                            <button
                                type="button"
                                className="remove-button"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering the file dialog
                                    handleImageRemove(index);
                                    setFailedImages(prev => prev.filter(url => url !== image));
                                }}
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileDrop;