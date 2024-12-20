import React, { useState } from "react";
import "./NewEntryPage.css";
import { useNavigate } from "react-router-dom";

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

    const navigate = useNavigate();

    const [uploadedImages, setUploadedImages] = useState([]);

    const [customOptions, setCustomOptions] = useState({
        categories: ["Procariote", "Eucariote"],
        cellTypes: ["Blood cell", "Stem cell", "Neuron", "Epithelial", "Endothelial", "Fibroblast", "Muscle cell", "Fat cell"],
        shapes: ["round", "oval", "columnar", "fusiform spindle", "cuboidal", "polygonal", "star-shaped", "pear-shaped"],
        imageModalities: ["LM light microscopy", "EM electron microscopy", "fluorescent microscopy", "electron tomography", "cryo-electron microscopy", "cryo-electron tomography"],
    });

    const [allKeywords, setAllKeywords] = useState([]);
    const [keywordSuggestions, setKeywordSuggestions] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

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

    const handleAddNewOption = (type) => {
        const newOption = prompt(`Add a new ${type}:`);
        if (newOption && !customOptions[type].includes(newOption.trim())) {
            setCustomOptions((prevOptions) => ({
                ...prevOptions,
                [type]: [...prevOptions[type], newOption.trim()],
            }));
            setFormData((prevFormData) => ({
                ...prevFormData,
                [type]: newOption.trim(),
            }));
        }
    };

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

    const handleKeywordClick = (keyword) => {
        setFormData({ ...formData, keywords: keyword });
        setKeywordSuggestions([]);
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
        console.log("All Keywords:", allKeywords);
        // Add submission logic here (e.g., API call)

        // Navigate to DatabasePage with new entry data
        navigate("/database", { state: { newEntry: formData } });
    };

    const handleAddCustomOption = (type, newOption) => {
        if (!newOption.trim()) return;

        setCustomOptions((prevOptions) => ({
            ...prevOptions,
            [type]: [...prevOptions[type], newOption.trim()],
        }));
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
                            handleImageUpload({target: {files: e.dataTransfer.files}});
                        }}
                    >
                        <div className="uploaded-images">
                            {uploadedImages.map((image, index) => (
                                <div className="uploaded-image" key={index}>
                                    <img src={image} alt={`Uploaded ${index + 1}`}/>
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
                                onChange={(e) => {
                                    if (e.target.value === "add-new") {
                                        const newCategory = prompt("Add a new category:");
                                        if (newCategory && !customOptions.categories.includes(newCategory.trim())) {
                                            handleAddCustomOption("categories", newCategory);
                                            setFormData((prev) => ({...prev, category: newCategory.trim()}));
                                        }
                                    } else {
                                        handleChange(e);
                                    }
                                }}
                            >
                                <option value="">Select category</option>
                                {customOptions.categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                                <option value="add-new" className="add-new-option">
                                    + Add New
                                </option>
                            </select>
                        </div>
                        <div className="field-group">
                            <label>Cell Type</label>
                            <select
                                name="cellType"
                                value={formData.cellType}
                                onChange={(e) => {
                                    if (e.target.value === "add-new") {
                                        handleAddNewOption("cellTypes");
                                    } else {
                                        handleChange(e);
                                    }
                                }}
                            >
                                <option value="">Select cell type</option>
                                {customOptions.cellTypes.map((cellType, index) => (
                                    <option key={index} value={cellType}>
                                        {cellType}
                                    </option>
                                ))}
                                <option value="add-new">+ Add New</option>
                            </select>
                        </div>
                        <div className="additional-fields">
                            <div className="field-group">
                                <label>Keywords</label>
                                <input
                                    type="text"
                                    name="keywords"
                                    value={formData.keywords}
                                    onChange={handleChange}
                                    placeholder="Add keywords (press ENTER to add)"
                                />
                                {keywordSuggestions.length > 0 && (
                                    <ul className="suggestions-list">
                                        {keywordSuggestions.map((keyword, index) => (
                                            <li
                                                key={index}
                                                className="suggestion-item"
                                                onClick={() => handleKeywordClick(keyword)}
                                            >
                                                {keyword}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <small>Press "Enter" to add a keyword</small>
                            </div>
                            <div className="field-group">
                                <label>Image Modality</label>
                                <select
                                    name="imageModality"
                                    value={formData.imageModality}
                                    onChange={(e) => {
                                        if (e.target.value === "add-new") {
                                            handleAddNewOption("imageModalities");
                                        } else {
                                            handleChange(e);
                                        }
                                    }}
                                >
                                    <option value="">Select image modality</option>
                                    {customOptions.imageModalities.map((modality, index) => (
                                        <option key={index} value={modality}>
                                            {modality}
                                        </option>
                                    ))}
                                    <option value="add-new">+ Add New</option>
                                </select>
                            </div>
                            <div className="field-group">
                                <label>Shape</label>
                                <select
                                    name="shape"
                                    value={formData.shape}
                                    onChange={(e) => {
                                        if (e.target.value === "add-new") {
                                            handleAddNewOption("shapes");
                                        } else {
                                            handleChange(e);
                                        }
                                    }}
                                >
                                    <option value="">Select shape</option>
                                    {customOptions.shapes.map((shape, index) => (
                                        <option key={index} value={shape}>
                                            {shape}
                                        </option>
                                    ))}
                                    <option value="add-new">+ Add New</option>
                                </select>
                            </div>
                            <div className="field-group">
                                <label>Cell Count</label>
                                <input
                                    type="number"
                                    name="cellCount"
                                    value={formData.cellCount}
                                    onChange={handleChange}
                                    placeholder="auto"
                                />
                            </div>
                            <div className="field-group">
                                <label>Cell Dimensions</label>
                                <input
                                    type="text"
                                    name="cellDimensions"
                                    value={formData.cellDimensions}
                                    onChange={handleChange}
                                    placeholder="auto"
                                />
                            </div>
                            <div className="field-group">
                                <label>Cell Density</label>
                                <input
                                    type="text"
                                    name="cellDensity"
                                    value={formData.cellDensity}
                                    onChange={handleChange}
                                    placeholder="auto"
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
                    </div>
                </div>
                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
};

export default NewEntryPage;
