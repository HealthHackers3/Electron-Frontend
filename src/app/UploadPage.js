import React, { useState, useRef, useEffect } from "react";
import "./UploadPage.css";
import FileDrop from "./FileDrop";
import { useNavigate } from "react-router-dom";
import {
    fetchCategories,
    fetchCellTypes,
    fetchImageModalities,
} from "../api/remote/postfieldsAPI";
import {fetchCellCount} from "../api/local/cellcountAPI";
import {uploadImages} from "../api/remote/testuploadAPI";

const UploadPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        domain: "",
        cellType: "",
        keywords: "",
        imageModality: "",
        shape: "",
        cellCount: "",
        cellDimensions: "",
        cellDensity: "",
        comments: "",
    });

    const [customOptions, setCustomOptions] = useState({
        domains: [],
        cellTypes: [],
        imageModalities: [],
    });

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [cellTypeQuery, setCellTypeQuery] = useState("");
    const [imageModalityQuery, setImageModalityQuery] = useState("");
    const [filteredCellTypes, setFilteredCellTypes] = useState([]);
    const [filteredImageModalities, setFilteredImageModalities] = useState([]);
    const [cellTypeDropdownVisible, setCellTypeDropdownVisible] = useState(false);
    const [imageModalityDropdownVisible, setImageModalityDropdownVisible] = useState(false);
    const [cellTypeDropdownStyle, setCellTypeDropdownStyle] = useState({});
    const [imageModalityDropdownStyle, setImageModalityDropdownStyle] = useState({});
    const cellTypeRef = useRef(null);
    const imageModalityRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOptionData = async () => {
            try {
                const [cellCategories, cellTypes, imageModalities] = await Promise.all([
                    fetchCategories(),
                    fetchCellTypes(),
                    fetchImageModalities(),
                ]);

                setCustomOptions((prevOptions) => ({
                    ...prevOptions,
                    domains: cellCategories.map((category) => category.category_name),
                    cellTypes: cellTypes.map((cell) => cell.cell_type_name),
                    imageModalities: imageModalities.map((image) => image.image_modality_name),
                }));
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchOptionData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSearchChange = (e, type) => {
        const value = e.target.value;
        if (type === "cellType") {
            setCellTypeQuery(value);
            setFilteredCellTypes(
                customOptions.cellTypes.filter((option) =>
                    option.toLowerCase().includes(value.toLowerCase())
                )
            );
            setCellTypeDropdownVisible(value.length > 0);
        } else if (type === "imageModality") {
            setImageModalityQuery(value);
            setFilteredImageModalities(
                customOptions.imageModalities.filter((option) =>
                    option.toLowerCase().includes(value.toLowerCase())
                )
            );
            setImageModalityDropdownVisible(value.length > 0);
        }
    };

    const handleDropdownSelect = (option, type) => {
        if (type === "cellType") {
            setFormData({ ...formData, cellType: option });
            setCellTypeQuery(option);
            setCellTypeDropdownVisible(false);
        } else if (type === "imageModality") {
            setFormData({ ...formData, imageModality: option });
            setImageModalityQuery(option);
            setImageModalityDropdownVisible(false);
        }
    };

    useEffect(() => {
        const updateDropdownStyle = (ref, setStyle) => {
            if (ref.current) {
                const boundingBox = ref.current.getBoundingClientRect();
                setStyle({
                    top: `${boundingBox.bottom + window.scrollY}px`, // Add scroll offset
                    left: `${boundingBox.left + window.scrollX}px`, // Add scroll offset
                    width: `${boundingBox.width}px`,
                });
            }
        };

        if (cellTypeDropdownVisible) updateDropdownStyle(cellTypeRef, setCellTypeDropdownStyle);
        if (imageModalityDropdownVisible)
            updateDropdownStyle(imageModalityRef, setImageModalityDropdownStyle);

        window.addEventListener("resize", () => {
            if (cellTypeDropdownVisible) updateDropdownStyle(cellTypeRef, setCellTypeDropdownStyle);
            if (imageModalityDropdownVisible)
                updateDropdownStyle(imageModalityRef, setImageModalityDropdownStyle);
        });

        return () => {
            window.removeEventListener("resize", () => {});
        };
    }, [cellTypeDropdownVisible, imageModalityDropdownVisible]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (uploadedFiles.length > 0) {
            const imageDataArray = [{
                fileBuffer: uploadedFiles[0], // The image data as a Buffer
                fileName: "abcdefg", // The image's original file name
                orderIndex: "1", // Index of the image
                cellCount: "45", // Example metadata
                cellDimensionsX: "60", // Example metadata
                cellDimensionsY: "15", // Example metadata
                cellDensity: "2", // Example metadata
            }];
            const r = uploadImages(imageDataArray);
            console.log(r);
        }
    };

    return (
        <div className="upload-page">

            <form className="upload-form" onSubmit={handleSubmit}>
                <div className="form-section">
                    <FileDrop
                        onFilesAdded={(newFiles) => setUploadedFiles((prev) => [...prev, ...newFiles])}
                        uploadedFiles={uploadedFiles}
                        handleFileRemove={(index) =>
                            setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
                        }
                    />

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

                            {/* Inside UploadPage component */}
                            <div className="field-group">
                                <label>Cell Type</label>
                                <input
                                    ref={cellTypeRef}
                                    type="text"
                                    value={cellTypeQuery}
                                    onChange={(e) => handleSearchChange(e, "cellType")}
                                    onFocus={() => setCellTypeDropdownVisible(cellTypeQuery.length > 0)}
                                    onBlur={() => setTimeout(() => setCellTypeDropdownVisible(false), 200)}
                                    placeholder="Select or type cell type"
                                />
                                {cellTypeDropdownVisible && (
                                    <div className="dropdown-container">
                                        {filteredCellTypes.length > 0 ? (
                                            filteredCellTypes.map((type, index) => (
                                                <div
                                                    key={index}
                                                    className="dropdown-option"
                                                    onClick={() => handleDropdownSelect(type, "cellType")}
                                                >
                                                    {type}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-matches">No matches found</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="field-group">
                                <label>Image Modality</label>
                                <input
                                    ref={imageModalityRef}
                                    type="text"
                                    value={imageModalityQuery}
                                    onChange={(e) => handleSearchChange(e, "imageModality")}
                                    onFocus={() => setImageModalityDropdownVisible(imageModalityQuery.length > 0)}
                                    onBlur={() => setTimeout(() => setImageModalityDropdownVisible(false), 200)}
                                    placeholder="Select or type image modality"
                                />
                                {imageModalityDropdownVisible && (
                                    <div className="dropdown-container">
                                        {filteredImageModalities.length > 0 ? (
                                            filteredImageModalities.map((modality, index) => (
                                                <div
                                                    key={index}
                                                    className="dropdown-option"
                                                    onClick={() => handleDropdownSelect(modality, "imageModality")}
                                                >
                                                    {modality}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-matches">No matches found</div>
                                        )}
                                    </div>
                                )}
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

                            <button type="submit" className="submit-button">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UploadPage;


