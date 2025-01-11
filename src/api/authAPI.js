const BASE_URL = "https://bioeng-hhack-app.impaas.uk/api";

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
            return error.error;
        }

        return (await response.json()).message; // Return user info or token
    } catch (error) {
        console.error("Failed to connect to the server:", error);
        return error.error;
    }
};

export const signupUser = async (username, email, password) => {
    try {
        console.log("Inputs to signupUser:", { username, email, password });
        if (!username || !email || !password) {
            console.error("Username Email and password are required.");
            return null;
        }

        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({ username, email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("Signup failed:", error.error);
            return error.error;
        }

        return (await response.json()).message; // Return user info or token
    } catch (error) {
        console.error("Signup failed:", error);
        return error.error;
    }
};