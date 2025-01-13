import path from "path";
import fs from "fs";

import FormData from "form-data";
import axios from "axios";
import * as error from "react-dom/test-utils";
import * as url from "node:url";

export const newPost = async (postData) => {
    const formData = new FormData();
    const url = `https://bioeng-hhack-app.impaas.uk/api`;
    // Append fields to the FormData object
    formData.append('post_name', postData.post_name);
    formData.append('category_id', postData.category_id);
    formData.append('cell_type_id', postData.cell_type_id);
    formData.append('image_modality_id', postData.image_modality_id);
    formData.append('category_user_picked', postData.category_user_picked || '');
    formData.append('cell_type_user_picked', postData.cell_type_user_picked || '');
    formData.append('image_modality_user_picked', postData.image_modality_user_picked || '');
    formData.append('description', postData.description || '');
    // console.log(formData);
    try {
        const response = await axios.post(`${url}/post/newpost/${postData.poster_id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error making new post request:', error);
        throw error;
    }
}
export const uploadImages = async (imageDataArray) => {
    const url = `https://bioeng-hhack-app.impaas.uk/api`;

    try {
        const formData = new FormData();

        // Iterate over the array of image data and append each image to the FormData
        imageDataArray.forEach((imageData, index) => {
            const {
                fileBuffer, // Expect Buffer or Blob instead of filePath
                fileName,   // Image file name (required for server recognition)
                orderIndex,
                cellCount,
                cellDimensionsX,
                cellDimensionsY,
                cellDensity,
            } = imageData;

            // Append the image file as a Blob
            formData.append(`file_${index}`, fileBuffer, fileName);

            // Append metadata with unique field names for each image
            formData.append(`order_index_${index}`, orderIndex);
            formData.append(`image_file_name_${index}`, fileName.replace(/\.[^/.]+$/, "")); // Remove file extension
            formData.append(`cell_count_${index}`, cellCount);
            formData.append(`cell_dimensions_x_${index}`, cellDimensionsX);
            formData.append(`cell_dimensions_y_${index}`, cellDimensionsY);
            formData.append(`cell_density_${index}`, cellDensity);
        });

        // Send the multipart request
        const response = await axios.post(`${url}/img/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        console.log('Upload Successful:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error uploading images:', error);
        return null;
    }
};
export const createCompletePost = async (postData, imageDataArray) => {
    try {
        // Step 1: Upload images and extract image IDs
        let imageIds = [];
        const uploadResponse = await uploadImages(imageDataArray);

        if (!uploadResponse) {
            throw new Error('Failed to upload images');
        }

        const responseParts = uploadResponse.split('}{').map((part, index, arr) => {
            if (index === 0) return part + '}';
            if (index === arr.length - 1) return '{' + part;
            return '{' + part + '}';
        });

        imageIds = responseParts.map(part => JSON.parse(part).image_id);

        if (imageIds.length === 0) {
            throw new Error('No image IDs returned from upload');
        }

        // Step 2: Create the post
        const postResponse = await newPost(postData);

        if (postResponse.hasOwnProperty('error')) {
            throw new Error(`Error creating post: ${postResponse.error}`);
        }

        const postId = postResponse.post_id;

        // Step 3: Attach each image to the post
        for (const imageId of imageIds) {
            await attachImgToPost(imageId, postId);
        }

        console.log('Post and images successfully created and attached:', { postId, imageIds });
        return { postId, imageIds }; // Return the created post ID and attached image IDs
    } catch (error) {
        console.error('Error creating complete post:', error.message);
        throw error; // Re-throw the error for further handling if needed
    }
};
export const attachImgToPost = async (imgId, postId) =>{
    const url = `https://bioeng-hhack-app.impaas.uk/api`;

    try {

        // const response = await fetch(`${this.url}/post/newpost/${postId}/${window.electron.getUserId()}`, {
        const response = await fetch(`${url}/img/settopost/${imgId}/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Server error: ${errorData.message}`);
        }

        const result = await response.json();
        return result; // Return the server's response (if needed)
    } catch (error) {
        throw error; // Re-throw the error for further handling if necessary
    }
}
export const deletePost = async (postId) => {

    // Update this URL with your server's endpoint
    const url = `https://bioeng-hhack-app.impaas.uk/api/post/deletepost/${postId}`;

    try {
        // Send DELETE request to the server
        const response = await fetch(url, {
            method: 'DELETE', // HTTP DELETE method
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        // Check if the response is successful
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Server error: ${errorData.error || 'Unknown error'}`);
        }

        // Parse the response
        const result = await response.json();
        console.log('Post deleted successfully:', result.message);
        return result; // Return the server's response
    } catch (error) {
        console.error('Error deleting post:', error.message);
        throw error; // Re-throw the error for further handling if necessary
    }
};
export const checkPostName = async (postName) => {
    const url = "https://bioeng-hhack-app.impaas.uk/api/post/checkname";

    try {
        // Make a GET request with the post name as a query parameter
        const response = await axios.get(url, {
            params: {
                name: postName,
            },
        });

        // Return the result (true or false) from the response
        return response.data.exists;
    } catch (error) {
        console.error("Error checking post name:", error);
        throw error; // Re-throw the error for further handling if necessary
    }
};


