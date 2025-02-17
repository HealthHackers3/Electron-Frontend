export async function fetchPostCoverImgID(postId) {
    const url = `https://bioeng-hhack-app.impaas.uk/api/post/coverImgId/${postId}`;

    try {
        // Make a GET request to the servlet endpoint
        const response = await fetch(url);

        // Check if the response is OK (status 200)
        if (!response.ok) {
            if (response.status === 404) {
                console.error(`No images found for the given post ID: ${postId}`);
                return null;
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        // Parse the JSON response
        const data = await response.json();

        // Validate and return the image ID
        if (data && typeof data.image_id === 'number') {
            return data.image_id; // Return the image ID
        } else {
            throw new Error("Unexpected response format or missing 'image_id'");
        }
    } catch (error) {
        console.error("Error fetching the cover image ID:", error);
        return null; // Return null in case of an error
    }
}
export async function fetchPostImages(postId) {
    const url = `https://bioeng-hhack-app.impaas.uk/api/post/postimgs/${postId}`;

    try {
        // Make a GET request to the servlet endpoint
        const response = await fetch(url);

        // Check if the response is OK (status 200)
        if (!response.ok) {
            if (response.status === 404) {
                console.error(`No images found for the given post ID: ${postId}`);
                return [];
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        // Parse the JSON response
        const data = await response.json();

        // Validate and return the image IDs
        if (Array.isArray(data)) {
            return data; // Return the array of image IDs
        } else {
            throw new Error("Unexpected response format or missing data");
        }
    } catch (error) {
        console.error("Error fetching the post images:", error);
        return []; // Return an empty array in case of an error
    }
}
export async function fetchPostInfo(postId) {
    const url = `https://bioeng-hhack-app.impaas.uk/api/post/info/${postId}`;

    try {
        // Make a GET request to the servlet endpoint
        const response = await fetch(url);

        // Check if the response is OK (status 200)
        if (!response.ok) {
            if (response.status === 404) {
                console.error(`Post with ID ${postId} not found.`);
                return null;
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        // Parse the JSON response
        const data = await response.json();

        // Return the post information
        if (data && typeof data === 'object') {
            return data; // Return the JSON object with post details
        } else {
            throw new Error("Unexpected response format or missing data");
        }
    } catch (error) {
        console.error("Error fetching post info:", error);
        return null; // Return null in case of an error
    }
}
export async function fetchLikedPosts(userId) {
    const url = `https://bioeng-hhack-app.impaas.uk/api/users/${userId}/favourites`;

    try {
        // Make a GET request to the servlet endpoint
        const response = await fetch(url);

        // Check if the response is OK (status 200)
        if (!response.ok) {
            if (response.status === 404) {
                console.error(`Post with ID ${postId} not found.`);
                return null;
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        // Parse the JSON response
        const data = await response.json();

        // Return the post information
        if (data && typeof data === 'object') {
            return data; // Return the JSON object with post details
        } else {
            throw new Error("Unexpected response format or missing data");
        }
    } catch (error) {
        console.error("Error fetching post info:", error);
        return null; // Return null in case of an error
    }
}
export async function fetchImgInfo(imageId) {
    const url = `https://bioeng-hhack-app.impaas.uk/api/img/properties/${imageId}`;

    try {
        // Make a GET request to the servlet endpoint
        const response = await fetch(url);

        // Check if the response is OK (status 200)
        if (!response.ok) {
            if (response.status === 404) {
                console.error(`Image with ID ${imageId} not found.`);
                return null;
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        }

        // Parse the JSON response
        const data = await response.json();

        // Return the post information
        if (data && typeof data === 'object') {
            return data; // Return the JSON object with post details
        } else {
            throw new Error("Unexpected response format or missing data");
        }
    } catch (error) {
        console.error("Error fetching image info:", error);
        return null; // Return null in case of an error
    }
}
export async function fetchPostsAZ() {
    const url = `https://bioeng-hhack-app.impaas.uk/api/post/postslistAZ`;

    try {
        // Make a GET request to the servlet endpoint
        const response = await fetch(url);

        // Check if the response is OK (status 200)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Return the post information
        if (data && typeof data === 'object') {
            return data; // Return the JSON object with post details
        } else {
            throw new Error("Unexpected response format or missing data");
        }
    } catch (error) {
        console.error("Error fetching posts");
        return null; // Return null in case of an error
    }
}
//fetchImgInfo(1).then(r => console.log(r));
//fetchLikedPosts(1).then(r => console.log(r));
fetchPostsAZ().then(r => console.log(r));