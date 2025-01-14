export async function searchPosts(searchQuery) {
    const url = `https://bioeng-hhack-app.impaas.uk/api/post/search`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: searchQuery }), // Send the search query in the request body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            console.log("Search results:", data);
            return data; // Return the array of results
        } else {
            console.warn("No results found or unexpected response format");
            return [];
        }
    } catch (error) {
        console.error("Error searching posts:", error);
        return [];
    }
}
searchPosts("te").then(r => console.log(r));
