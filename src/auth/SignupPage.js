import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import { signupUser } from '../api/authAPI';

// SignupPage component definition
const SignupPage = () => {
    const { signup } = useAuth(); // Access the signup function from the AuthContext
    const navigate = useNavigate(); // Initialize the navigate function for navigation

    // State variables for form inputs and errors
    const [username, setUsername] = useState(''); // State variable for username input
    const [email, setEmail] = useState(''); // State variable for email input
    const [password, setPassword] = useState(''); // State variable for password input
    const [confirmPassword, setConfirmPassword] = useState(''); // State variable for confirm password input
    const [errors, setErrors] = useState({}); // State variable for form errors

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        // Check for client-side errors (e.g., passwords don't match)
        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            setErrors(newErrors);
            return;
        }

        try {
            // Attempt to signup the user using the API
            const response = await signupUser(username, email, password);
            console.log(response); // Log the response to the console

            // Handle server-side errors
            if (response) {
                if (response.includes('Key (username)')) {
                    newErrors.username = 'Username already exists';
                } else if (response.includes('Key (email)')) {
                    newErrors.email = 'Email already exists';
                } else if (response.includes('successful')) {
                    navigate('/'); // Navigate to the next page if successful
                    return;
                } else {
                    newErrors.general = 'Signup failed!'; // Set a general error message for other outcomes
                }
            } else {
                console.error('Response is empty', response); // Set a general error message for empty responses
                newErrors.general = 'An unexpected error occurred. Please try again.';
            }
        } catch (error) {
            console.error('Signup error:', error);
            newErrors.general = 'An unexpected error occurred. Please try again.';
        }

        setErrors(newErrors); // Update errors state
    };

    return (
        <div className="signup-container">
            <div className="signup-box">
                {/* Heading for the signup form */}
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit} className="signup-form">
                    {/* Username input field */}
                    <div className={`form-group ${errors.username ? 'error' : ''}`}>
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        {errors.username && <p className="error-text">{errors.username}</p>}
                    </div>
                    {/* Email input field */}
                    <div className={`form-group ${errors.email ? 'error' : ''}`}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {errors.email && <p className="error-text">{errors.email}</p>}
                    </div>
                    {/* Password input field */}
                    <div className={`form-group ${errors.password ? 'error' : ''}`}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {errors.password && <p className="error-text">{errors.password}</p>}
                    </div>
                    {/* Confirm Password input field */}
                    <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
                    </div>
                    {/* Display general error message if exists */}
                    {errors.general && <p className="error-text">{errors.general}</p>}
                    {/* Signup button */}
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    );
};

export default SignupPage;