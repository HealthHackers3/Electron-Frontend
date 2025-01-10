const BASE_URL = "http://localhost:8080/HHDatabase/api";

export const loginUser = async (email, password) => {
    try {
        console.log("Inputs to loginUser:", { email, password });
        if (!email || !password) {
            console.error("Email and password are required.");
            return null;
        }

        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Login failed:", error.error);
            return false;
        }

        return await response.json(); // Return user info or token
    } catch (error) {
        console.error("Failed to connect to the server:", error);
        return null;
    }
};