import React, { useState } from "react";
import "./UploadPage.css";
import FileDrop from "./FileDrop";
import { useNavigate } from "react-router-dom";

const UploadPage = () => {
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
    const navigate = useNavigate();

    // Instead of using prompt, we'll handle "Add New" with a custom mini-form.
    const [showAddNew, setShowAddNew] = useState(false);
    const [addNewType, setAddNewType] = useState("");
    const [newOptionValue, setNewOptionValue] = useState("");

    // We store the custom dropdown lists here.
    const [customOptions, setCustomOptions] = useState({
        categories: ["Procariote", "Eucariote"],
        cellTypes: [
            "Blood cell",
            "Stem cell",
            "Neuron",
            "Epithelial",
            "Endothelial",
            "Fibroblast",
            "Muscle cell",
            "Fat cell",
        ],
        shapes: [
            "round",
            "oval",
            "columnar",
            "fusiform spindle",
            "cuboidal",
            "polygonal",
            "star-shaped",
            "pear-shaped",
        ],
        imageModalities: [
            "LM light microscopy",
            "EM electron microscopy",
            "fluorescent microscopy",
            "electron tomography",
            "cryo-electron microscopy",
            "cryo-electron tomography",
        ],
    });

    const [allKeywords, setAllKeywords] = useState([]);
    const [keywordSuggestions, setKeywordSuggestions] = useState([]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // For keyword suggestions
        if (name === "keywords") {
            const trimmedValue = value.trim().toLowerCase();
            if (trimmedValue) {
                const matchingSuggestions = allKeywords.filter((keyword) =>
                    keyword.toLowerCase().includes(trimmedValue)
                );
                setKeywordSuggestions(matchingSuggestions);
            } else {
                setKeywordSuggestions([]);
            }
        }
    };

    // Handle adding keyword on Enter
    const handleAddKeyword = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const keyword = formData.keywords.trim();
            if (keyword && !allKeywords.includes(keyword)) {
                setAllKeywords((prevKeywords) => [...prevKeywords, keyword]);
            }
            setFormData({ ...formData, keywords: "" });
            setKeywordSuggestions([]);
        }
    };

    // Handle keyword suggestion click
    const handleKeywordClick = (keyword) => {
        setFormData({ ...formData, keywords: keyword });
        setKeywordSuggestions([]);
    };

    // Handle files added from FileDrop
    const handleFilesAdded = (newFiles) => {
        const validImages = newFiles.filter(file =>
            file.type.startsWith("image/")
        );
        const newImageURLs = validImages.map(file => URL.createObjectURL(file));

        setUploadedImages(prev => [...prev, ...newImageURLs]);
    };

    // Remove an uploaded image
    const handleImageRemove = (index) => {
        const updatedImages = [...uploadedImages];
        updatedImages.splice(index, 1);
        setUploadedImages(updatedImages);
    };

    // Submit form
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("New Entry Submitted:", formData);
        console.log("Uploaded Images:", uploadedImages);
        console.log("All Keywords:", allKeywords);
        // Add submission logic (e.g. API call) here
        navigate("/search", { state: { newEntry: formData } });
    };

    // Handle selecting "Add New" from dropdowns
    const handleSelectAddNew = (type) => {
        // Show mini form for adding new entry
        setAddNewType(type);
        setShowAddNew(true);
        setNewOptionValue("");
    };

    // Add the new option from the mini-form
    const handleAddNewOption = () => {
        if (newOptionValue.trim() && !customOptions[addNewType].includes(newOptionValue.trim())) {
            setCustomOptions((prevOptions) => ({
                ...prevOptions,
                [addNewType]: [...prevOptions[addNewType], newOptionValue.trim()],
            }));
            // Also set that new option in formData
            setFormData((prev) => ({
                ...prev,
                [addNewType]: newOptionValue.trim(),
            }));
        }
        // Hide the mini form again
        setShowAddNew(false);
        setNewOptionValue("");
        setAddNewType("");
    };

    // Map internal object keys to user-friendly labels:
    const labelMap = {
        categories: "Category",
        cellTypes: "Cell Type",
        shapes: "Shape",
        imageModalities: "Image Modality",
        // etc.
    };

    return (
        <div className="upload-page">
            <h1>Upload Images</h1>

            {showAddNew && (
                <div className="add-new-overlay">
                    <div className="add-new-modal">
                        <h3>Add a new {labelMap[addNewType] ?? addNewType}</h3>
                        <input
                            type="text"
                            value={newOptionValue}
                            onChange={(e) => setNewOptionValue(e.target.value)}
                            placeholder={`Enter new ${addNewType}`}
                        />
                        <div className="modal-buttons">
                            <button className="save-button" onClick={handleAddNewOption}>
                                Save
                            </button>
                            <button
                                className="cancel-button"
                                onClick={() => {
                                    setShowAddNew(false);
                                    setNewOptionValue("");
                                    setAddNewType("");
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}


            <form className="upload-form" onSubmit={handleSubmit}>
                <div className="form-section">
                    {/* Updated Image Upload Section */}
                    <FileDrop
                        onFilesAdded={handleFilesAdded}
                        uploadedImages={uploadedImages}
                        handleImageRemove={handleImageRemove}
                    />

                    {/* Form fields */}
                    <div className="form-fields-wrapper">
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

                            {/* Grouping Category, Cell Type, etc. together */}
                            <fieldset className="field-group fieldset-group">
                                <legend>Classification</legend>

                                <div className="field-subgroup">
                                    <label>Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={(e) => {
                                            if (e.target.value === "add-new") {
                                                handleSelectAddNew("categories");
                                            } else {
                                                handleChange(e);
                                            }
                                        }}
                                    >
                                        <option value="">Select Category</option>
                                        {customOptions.categories.map((cat, index) => (
                                            <option key={index} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                        <option value="add-new" className="add-new-option">
                                            + Add New
                                        </option>
                                    </select>
                                </div>

                                <div className="field-subgroup">
                                    <label>Cell Type</label>
                                    <select
                                        name="cellType"
                                        value={formData.cellType}
                                        onChange={(e) => {
                                            if (e.target.value === "add-new") {
                                                handleSelectAddNew("cellTypes");
                                            } else {
                                                handleChange(e);
                                            }
                                        }}
                                    >
                                        <option value="">Select Cell Type</option>
                                        {customOptions.cellTypes.map((cellType, index) => (
                                            <option key={index} value={cellType}>
                                                {cellType}
                                            </option>
                                        ))}
                                        <option value="add-new">+ Add New</option>
                                    </select>
                                </div>

                                <div className="field-subgroup">
                                    <label>Image Modality</label>
                                    <select
                                        name="imageModality"
                                        value={formData.imageModality}
                                        onChange={(e) => {
                                            if (e.target.value === "add-new") {
                                                handleSelectAddNew("imageModalities");
                                            } else {
                                                handleChange(e);
                                            }
                                        }}
                                    >
                                        <option value="">Select Image Modality</option>
                                        {customOptions.imageModalities.map((modality, index) => (
                                            <option key={index} value={modality}>
                                                {modality}
                                            </option>
                                        ))}
                                        <option value="add-new">+ Add New</option>
                                    </select>
                                </div>

                                <div className="field-subgroup">
                                    <label>Shape</label>
                                    <select
                                        name="shape"
                                        value={formData.shape}
                                        onChange={(e) => {
                                            if (e.target.value === "add-new") {
                                                handleSelectAddNew("shapes");
                                            } else {
                                                handleChange(e);
                                            }
                                        }}
                                    >
                                        <option value="">Select Shape</option>
                                        {customOptions.shapes.map((shape, index) => (
                                            <option key={index} value={shape}>
                                                {shape}
                                            </option>
                                        ))}
                                        <option value="add-new">+ Add New</option>
                                    </select>
                                </div>
                            </fieldset>

                            <div className="field-subgroup">

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
                        </div>
                        <button type="submit" className="submit-button">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UploadPage;
