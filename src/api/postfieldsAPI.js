export async function fetchCategories() {
    const url = `https://bioeng-hhack-app.impaas.uk/api/post/getcategories`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            return data[0]; // Return the username
        } else {
            throw new Error("Unexpected response format or empty array");
        }
    } catch (error) {
        console.error("Error fetching the categories:", error);
        return null; // Return null in case of an error
    }
}
export async function fetchCellTypes() {
    const url = `https://bioeng-hhack-app.impaas.uk/api/post/getcelltypes`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            return data[0]; // Return the username
        } else {
            throw new Error("Unexpected response format or empty array");
        }
    } catch (error) {
        console.error("Error fetching the celltypes:", error);
        return null; // Return null in case of an error
    }
}
export async function fetchImageModalities() {
    const url = `https://bioeng-hhack-app.impaas.uk/api/post/getimagemodalities`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            return data[0]; // Return the username
        } else {
            throw new Error("Unexpected response format or empty array");
        }
    } catch (error) {
        console.error("Error fetching the image modalities:", error);
        return null; // Return null in case of an error
    }
}
//fetchImageModalities().then(response => console.log(response.toString()));