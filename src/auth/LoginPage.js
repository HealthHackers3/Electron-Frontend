import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { loginUser } from '../api/authAPI';

const LoginPage = () => {
    const { login } = useAuth(); // Access the login function from the AuthContext
    const [email, setEmail] = useState(''); // State variable for email input
    const [password, setPassword] = useState(''); // State variable for password input
    const [errors, setErrors] = useState({}); // State variable for form errors
    const location = useLocation(); // Get the current location object
    const navigate = useNavigate(); // Initialize the navigate function for navigation

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {}; // Initialize a new error object to hold validation od API errors
        try {
            // Attempt to login the user using the API
            const response = await loginUser(email, password);
            console.log(response); // Log the response to the console

            if (response) {
                // Check the response for login outcomes
                if (response.includes('Invalid username or password')) {
                    // Set error message for invalid username or password
                    newErrors.general = 'Invalid username or password';
                    newErrors.email = true;
                    newErrors.password = true;
                } else if (response.includes('successful')) {
                    // Successful login
                    login();
                    navigate('/'); // Navigate to the next page
                    return;
                } else {
                    // Set a general error message for other outcomes
                    newErrors.general = 'Signin failed!';
                }
            } else {
                // Set a general error message for empty responses
                console.error('Response is empty', response);
                newErrors.general = 'An unexpected error occurred. Please try again.';
            }
        } catch (error) {
            // Handle API errors
            console.error('Login error:', error);
            newErrors.general = 'An unexpected error occurred. Please try again.';
        }

        // Update the errors state with the new error object
        setErrors(newErrors);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                { /* Heading for the login form */}
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    { /* Email input field */}
                    <div className={`form-group ${errors.email ? 'error' : ''}`}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    { /* Password input field */}
                    <div className={`form-group ${errors.password ? 'error' : ''}`}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    { /* Display general error message if exists*/}
                    {errors.general && <p className="error-message">{errors.general}</p>}
                    <button type="submit">Login</button>
                </form>
                { /* Link to the signup page */}
                <p>Don't have an account? <a href="/signup">Sign up</a></p>
            </div>
        </div>
    );
};

export default LoginPage;