import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import "./UploadPage.css";
import FileDrop from "./FileDrop";
import { useNavigate } from "react-router-dom";
import {
    fetchCategories,
    fetchCellTypes,
    fetchImageModalities,
} from "../api/remote/postfieldsAPI";
import {fetchCellCount} from "../api/local/cellcountAPI";
import {createCompletePost} from "../api/remote/postAPI";

const UploadPage = () => {
    const [postName, setPostName] = useState("");
    const [postComment, setPostComment] = useState("");

    const [customOptions, setCustomOptions] = useState({
        domains: [],
        cellTypes: [],
        imageModalities: [],
    });

    const [lookupTables, setLookupTables] = useState({
        domainMap: {}, // Map of domain names to IDs
        cellTypeMap: {}, // Map of cell type names to IDs
        imageModalityMap: {}, // Map of image modality names to IDs
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

                console.log(cellCategories);
                console.log(cellTypes);
                console.log(imageModalities);

                // Create the lookup maps for IDs
                const domainMap = cellCategories.reduce((map, category) => {
                    map[category.category_name] = category.category_id;
                    return map;
                }, {});

                const cellTypeMap = cellTypes.reduce((map, cell) => {
                    map[cell.cell_type_name] = cell.cell_type_id;
                    return map;
                }, {});

                const imageModalityMap = imageModalities.reduce((map, image) => {
                    map[image.image_modality_name] = image.image_modality_id;
                    return map;
                }, {});

                setCustomOptions((prevOptions) => ({
                    ...prevOptions,
                    domains: cellCategories.map((category) => category.category_name),
                    cellTypes: cellTypes.map((cell) => cell.cell_type_name),
                    imageModalities: imageModalities.map((image) => image.image_modality_name),
                }));

                setLookupTables({
                    domainMap,
                    cellTypeMap,
                    imageModalityMap,
                });

                console.log(lookupTables)
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        };

        fetchOptionData();
    }, []);

    // Function to look up ID by string
    const lookupId = (type, name) => {
        switch (type) {
            case 'domain':
                return lookupTables.domainMap[name];
            case 'cellType':
                return lookupTables.cellTypeMap[name];
            case 'imageModality':
                return lookupTables.imageModalityMap[name];
            default:
                return null;
        }
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setPostName(value);
    };

    const handleCommentChange = (e) => {
        const value = e.target.value;
        setPostComment(value);
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
            setCellTypeQuery(option);
            setCellTypeDropdownVisible(false);
        } else if (type === "imageModality") {
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


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (uploadedFiles.length === 0) {
            console.error("No files uploaded.");
            return;
        }

        try {
            // Map cellTypeQuery and imageModalityQuery to their respective IDs or default to 1
            console.log(cellTypeQuery);
            console.log(imageModalityQuery);
            const cellTypeId = lookupId("cellType", cellTypeQuery) || 1;
            const imageModalityId = lookupId("imageModality", imageModalityQuery) || 1;
            console.log(cellTypeId);
            console.log(imageModalityId);

            // Create the postData object
            const postData = {
                poster_id: window.electron.getUserId(),
                post_name: postName || "Default Post Name", // Use placeholder if postName is empty
                category_id: 2, // Example placeholder value, adjust as needed
                cell_type_id: cellTypeId,
                image_modality_id: imageModalityId,
                description: postComment || "", // Optional description
            };

            // Only include user-picked fields if IDs are 1
            if (cellTypeId === 1) {
                postData.cell_type_user_picked = cellTypeQuery;
            }
            if (imageModalityId === 1) {
                postData.image_modality_user_picked = imageModalityQuery;
            }

            console.log(postData);

            // Prepare the imageDataArray for the API
            const imageDataArray = await Promise.all(uploadedFiles.map(async (file, index) => ({
                fileBuffer: file, // Replace with the actual file data
                fileName: `${uuidv4()}`, // Generate a random UUID
                orderIndex: index + 1, // Maintain order index for each file
                cellCount: await fetchCellCount(file), // Fetch cell count dynamically
                cellDimensionsX: 100, // Placeholder values
                cellDimensionsY: 100, // Placeholder values
                cellDensity: 1,      // Placeholder values
            })));

            // Call the createCompletePost API
            const response = await createCompletePost(postData, imageDataArray);

            console.log("Post successfully created with response:", response);
            // Optionally, navigate to another page or reset the form after success
            navigate("/search");
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Please try again.");
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
                                    value={postName}
                                    onChange={handleNameChange}
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
                                    value={postComment}
                                    onChange={handleCommentChange}
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


