import path from "path";
import fs from "fs";

const FormData = require("form-data");
const axios = require("axios");


export const newPost = async (postData) =>
{
    const formData = new FormData();

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
        const response = await axios.post(`${this.url}/post/newpost/${postData.poster_id}`, formData, {
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


export const uploadImages = async (imageDataArray, postID) =>
{
        try {
            const formData = new FormData();

            // Iterate over the array of image data and append each to the FormData
            imageDataArray.forEach((imageData, index) => {

                const {
                    filePath,
                    orderIndex,
                    cellCount,
                    cellDimensionsX,
                    cellDimensionsY,
                    cellDensity,
                } = imageData;

                const imageFileName = path.basename(filePath, path.extname(filePath));
                // Append file
                formData.append(`file_${index}`, fs.createReadStream(filePath));

                // Append metadata with unique field names for each image
                formData.append(`order_index_${index}`, orderIndex);
                formData.append(`image_file_name_${index}`, imageFileName);
                formData.append(`cell_count_${index}`, cellCount);
                formData.append(`cell_dimensions_x_${index}`, cellDimensionsX);
                formData.append(`cell_dimensions_y_${index}`, cellDimensionsY);
                formData.append(`cell_density_${index}`, cellDensity);
            });

            // Send the multipart request
            const response = await axios.post(`${this.url}/img/upload/` + postID, formData, {
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
    }

export const createCompletePost = async (postData, imageDataArray) =>
{
    try {
        let postId;
        await newPost(postData).then(response => {
            postId = response
        });
        try {
            await uploadImages(imageDataArray, postId);
        }catch(error) {
            console.error('Error uploading images:', error);
        }
        console.log("successfully created post:", postId);
    }catch(error){
        console.error('Error creating post:', error);
    }

}