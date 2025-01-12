export async function fetchCellCount(image_file_path) {
    const url = `http://localhost:${window.electron.getPort()}/count_cells`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Declares the content type as JSON
            },
            body: JSON.stringify({ image_file_path }), // Send the body as a JSON string
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        if (data.cell_count !== undefined) {
            return data.cell_count; // Return the data
        } else {
            throw new Error("Unexpected response format or empty array");
        }
    } catch (error) {
        console.error("Error fetching the cell count:", error);
        return null; // Return null in case of an error
    }
}
