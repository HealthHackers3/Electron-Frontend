
const FormData = require('form-data');

const path = require('path');
const fs = require('fs');
const axios = require('axios');
//const fetch = require('node-fetch');

class RequestManager {
    constructor() {
        this.url = "https://bioeng-hhack-app.impaas.uk/api";
        console.log("rm");
    }

    async GET(url) {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "charset": "utf-8",
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseBody = await response.json();
            console.log(responseBody);
        } catch (error) {
            console.error("Error in GET:", error);
        }
    }

    async POST(url, formData) {
        try {
            // Send POST request using fetch API
            const response = await fetch(url, {
                method: 'POST',
                body: formData, // The body is the FormData object
                headers: formData.getHeaders(), // Set headers for multipart
            });

            // Check if the response is ok (status code 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse the JSON response (if any)
            const data = await response.json();
            console.log("Response:", data);

            return data;
        } catch (error) {
            console.error("Error sending POST request:", error);
        }
    }

    async SQL(url, sqlQuery) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "text/plain", // Assuming the server expects raw SQL queries
                    "charset": "utf-8",
                },
                body: sqlQuery,
                credentials: "include",
            });

            if (!response.ok) {
                console.log(response);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseBody = await response.json();
            console.log(responseBody);
        } catch (error) {
            console.error("Error in SQL:", error);
        }
    }

}
class RequestTools {
    constructor() {}
    metadataFormater(postData, imagePath) {
        const formData = new FormData();
        // Append metadata to the formData
        formData.append('title', postData.title);       // Post title
        formData.append('description', postData.description); // Post description
        formData.append('category_id', postData.category_id); // Category ID
        formData.append('cell_type_id', postData.cell_type_id); // Cell type ID
        formData.append('image_modality_id', postData.image_modality_id); // Image modality ID
        formData.append('cell_shape_id', postData.cell_shape_id); // Cell shape ID
        formData.append('likes', postData.likes); // Number of likes (if applicable)

        // Append the image file to the formData
        const fileStream = fs.createReadStream(imagePath);
        // formData.append('image', fileStream, {
        //     filename: 'Large_cell_carcinoma_of_the_lung.jpg',
        //     contentType: 'image/jpeg',
        // });
        formData.append('image', fileStream, 'Large_cell_carcinoma_of_the_lung.jpg');
        return formData;
    }
}
class imgQuery{
    constructor(){
        this.url = "https://bioeng-hhack-app.impaas.uk/api";
        //this.url = "http://localhost:8080/HHDatabase/api";
    }
    async uploadImages(imageDataArray, postID) {
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

}
class postQuery{
    constructor(){
        this.url = "https://bioeng-hhack-app.impaas.uk/api";
    }
    async newPost(postData) {
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
}
const addUser = async (userData) => {
    try {
        this.url = "https://bioeng-hhack-app.impaas.uk/api";
        const response = await fetch(`${this.url}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json" // Use JSON for structured data
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Error:", error.error);
        } else {
            const result = await response.json();
            console.log("Success:", result.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to connect to the server.");
    }
};
const loginUser = async (username, password) => {
    try {
        // Ensure username and password are provided
        if (!username || !password) {
            console.error("Username and password are required.");
            return;
        }
        this.url = "https://bioeng-hhack-app.impaas.uk/api";
        // Make the POST request
        const response = await fetch(`${this.url}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded" // Sending URL-encoded form data
            },
            body: new URLSearchParams({ username, password }) // Encode the username and password
        });

        // Handle the response
        if (!response.ok) {
            const error = await response.json();
            console.error("Login failed:", error.error);
            return;
        }

        const data = await response.json();
        console.log("Login successful:", data);

        // Store user UUID and cookie info in a secure way if needed
    } catch (error) {
        console.error("Failed to connect to the server:", error);
    }
};
const updateUserField = async (uuid, field, new_data) => {
    try {
        this.url = "https://bioeng-hhack-app.impaas.uk/api";
        const response = await fetch(`${this.url}/auth/login/`+uuid+"/"+field, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "text/plain", // Assuming the server expects raw SQL queries
                "charset": "utf-8",
            },
            body: new_data,
            credentials: "include",
        });
        await response;
    }catch (error) {
        console.error("Error:", error);
    }
}
// Usage Example:
//loginUser("johndoe", "securepassword123");
// rm = new RequestManager();
// rm.SQL("http://localhost:8080/HHDatabase/api/sqlraw", "SELECT * FROM Lusers")
//updateUserField(1,"email","testemail@test.com")



// const userData = {
//     username: "sctc",
//     password: "sampass",
//     email: "sct@m.com"
//     // username: "bobq",
//     // password: "test321",
//     // email: "b@m.com"
// };
// addUser(userData).then(r => console.log(r));


const postQueryInstance = new postQuery();
const postData = {
    poster_id: '3',
     post_name: 'More cells',
     category_id: '3',
    cell_type_id: '4',
    image_modality_id: '1',
     image_modality_user_picked: 'microscope',
     description: 'Microscope images'
 };
//
// postQueryInstance.newPost(postData).then((response) => {console.log(response)});
//
// module.exports = { RequestManager };
//
// const imageDataArray = [
//     {
//         filePath: 'C:\\Users\\sctcl\\Electron-Frontend-updated\\src\\testvars\\eletronmicr.jpeg',
//         orderIndex: '0',
//         cellCount: '45',
//         cellDimensionsX: '60',
//         cellDimensionsY: '15',
//         cellDensity: '2',
//     },
//     {
//         filePath: 'C:\\Users\\sctcl\\Electron-Frontend-updated\\src\\testvars\\ultrastructurealtake.jpeg',
//         orderIndex: '1',
//         cellCount: '45',
//         cellDimensionsX: '60',
//         cellDimensionsY: '15',
//         cellDensity: '2',
//     },
// ];
//
// iq= new imgQuery();
// iq.uploadImages(imageDataArray, 1);
