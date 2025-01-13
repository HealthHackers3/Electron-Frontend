import FormData from "form-data";
import axios from "axios";

export async function fetchCellCount(fileBuffer) {
    const url = `http://localhost:${window.electron.getPort()}/count_cells`;

    const formData = new FormData();
    formData.append("image", fileBuffer); // Append the image file to the form data

    try {
        const response = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data", // Ensure the correct content type
            },
        });

        if (response.status !== 200) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = response.data;
        console.log(data);

        if (data.cell_count !== undefined) {
            return data.cell_count; // Return the cell count
        } else {
            throw new Error("Unexpected response format or empty data");
        }
    } catch (error) {
        console.error("Error fetching the cell count:", error);
        return null; // Return null in case of an error
    }
}
