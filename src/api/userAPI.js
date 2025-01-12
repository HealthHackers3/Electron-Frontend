export async function fetchUserUsername(userId) {
    const url = `https://bioeng-hhack-app.impaas.uk/api/users/${window.electron.getUserId()}/username`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            const username = data[0].username;
            return username; // Return the username
        } else {
            throw new Error("Unexpected response format or empty array");
        }
    } catch (error) {
        console.error("Error fetching the username:", error);
        return null; // Return null in case of an error
    }
}
export async function fetchUserDate(userId) {
    const url = `https://bioeng-hhack-app.impaas.uk/api/users/${window.electron.getUserId()}/date`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            const created_at = data[0].created_at;
            return created_at;
        } else {
            throw new Error("Unexpected response format or empty array");
        }
    } catch (error) {
        console.error("Error fetching the created_at:", error);
        return null;
    }
}
export async function fetchUserEmail(userId) {
    const url = `https://bioeng-hhack-app.impaas.uk/api/users/${window.electron.getUserId()}/email`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            const email = data[0].email;
            console.log(email);
            return email;
        } else {
            throw new Error("Unexpected response format or empty array");
        }
    } catch (error) {
        console.error("Error fetching the email:", error);
        return null;
    }
}


