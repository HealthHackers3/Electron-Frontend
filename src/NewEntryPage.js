import React, { useState } from "react";
import "./NewEntryPage.css";

const NewEntryPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        cellType: "",
        keywords: "",
        imageModality: "",
        shape: "",
        cellCount: "",
        cellDimensions: "",
        cellDensity: "",
        comments: "",
    });

    const [uploadedImages, setUploadedImages] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const validImages = files.filter((file) =>
            file.type.startsWith("image/")
        );

        const newImages = validImages.map((file) =>
            URL.createObjectURL(file)
        );
        setUploadedImages([...uploadedImages, ...newImages]);
    };

    const handleImageRemove = (index) => {
        const updatedImages = [...uploadedImages];
        updatedImages.splice(index, 1);
        setUploadedImages(updatedImages);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("New Entry Submitted:", formData);
        console.log("Uploaded Images:", uploadedImages);
        // Add submission logic here (e.g., API call)
    };

    return (
        <div className="new-entry-page">
            <h1>New Cell</h1>
            <form className="new-entry-form" onSubmit={handleSubmit}>
                <div className="form-section">
                    <div
                        className="image-upload"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                            e.preventDefault();
                            handleImageUpload({ target: { files: e.dataTransfer.files } });
                        }}
                    >
                        <div className="uploaded-images">
                            {uploadedImages.map((image, index) => (
                                <div className="uploaded-image" key={index}>
                                    <img src={image} alt={`Uploaded ${index + 1}`} />
                                    <button
                                        type="button"
                                        className="remove-button"
                                        onClick={() => handleImageRemove(index)}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        <label className="add-more-label">
                            + Add more
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden-file-input"
                                onChange={handleImageUpload}
                            />
                        </label>
                    </div>
                    <div className="form-fields">
                        <div className="field-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter cell name"
                            />
                        </div>
                        <div className="field-group">
                            <label>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">Select category</option>
                                <option value="Neuron">Neuron</option>
                                <option value="Blood Cell">Blood Cell</option>
                                <option value="Muscle Cell">Muscle Cell</option>
                            </select>
                        </div>
                        <div className="field-group">
                            <label>Cell Type</label>
                            <select
                                name="cellType"
                                value={formData.cellType}
                                onChange={handleChange}
                            >
                                <option value="">Select cell type</option>
                                <option value="Type A">Type A</option>
                                <option value="Type B">Type B</option>
                                <option value="Type C">Type C</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="additional-fields">
                    <div className="field-group">
                        <label>Keywords</label>
                        <input
                            type="text"
                            name="keywords"
                            value={formData.keywords}
                            onChange={handleChange}
                            placeholder="Add keywords (comma-separated)"
                        />
                    </div>
                    <div className="field-group">
                        <label>Image Modality</label>
                        <input
                            type="text"
                            name="imageModality"
                            value={formData.imageModality}
                            onChange={handleChange}
                            placeholder="Enter image modality"
                        />
                    </div>
                    <div className="field-group">
                        <label>Shape</label>
                        <input
                            type="text"
                            name="shape"
                            value={formData.shape}
                            onChange={handleChange}
                            placeholder="Enter shape"
                        />
                    </div>
                    <div className="field-group">
                        <label>Cell Count</label>
                        <input
                            type="number"
                            name="cellCount"
                            value={formData.cellCount}
                            onChange={handleChange}
                            placeholder="Enter cell count"
                        />
                    </div>
                    <div className="field-group">
                        <label>Cell Dimensions</label>
                        <input
                            type="text"
                            name="cellDimensions"
                            value={formData.cellDimensions}
                            onChange={handleChange}
                            placeholder="Enter dimensions (e.g., 50x50)"
                        />
                    </div>
                    <div className="field-group">
                        <label>Cell Density</label>
                        <input
                            type="text"
                            name="cellDensity"
                            value={formData.cellDensity}
                            onChange={handleChange}
                            placeholder="Enter cell density"
                        />
                    </div>
                    <div className="field-group">
                        <label>Comments</label>
                        <textarea
                            name="comments"
                            value={formData.comments}
                            onChange={handleChange}
                            placeholder="Add comments"
                        ></textarea>
                    </div>
                </div>
                <button type="submit" className="submit-button">
                    Save Entry
                </button>
            </form>
        </div>
    );
};

export default NewEntryPage;
