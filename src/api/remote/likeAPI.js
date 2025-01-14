export const addLike = async (postId) => {
    const url = `https://bioeng-hhack-app.impaas.uk/api`;
    try {

        // const response = await fetch(`${this.url}/post/newpost/${postId}/${window.electron.getUserId()}`, {
        const response = await fetch(`${url}/post/like/${postId}/${window.electron.getUserId()}`, {
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
};
export const removeLike = async (postId) => {
    const url = `https://bioeng-hhack-app.impaas.uk/api`;
    try {
        // Make a request to remove the like
        const response = await fetch(`${url}/post/unlike/${postId}/${window.electron.getUserId()}`, {
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

        return await response.json(); // Return the server's response (if needed)
    } catch (error) {
        throw error; // Re-throw the error for further handling if necessary
    }
};
export const getLikeStatus = async (postId) => {
    const url = `https://bioeng-hhack-app.impaas.uk/api`; // Update with your server's endpoint

    try {
        // Make a GET request to check the like status
        const response = await fetch(`${url}/post/likestatus/${postId}/${window.electron.getUserId()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Server error: ${errorData.error || "Unknown error"}`);
        }

        const result = await response.json();
        console.log('Like status retrieved:', result);

        return result.has_liked;
    } catch (error) {
        console.error('Error retrieving like status:', error);
        throw error; // Re-throw the error for further handling if necessary
    }
};