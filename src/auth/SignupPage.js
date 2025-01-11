import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import { signupUser } from '../api/authAPI';

const SignupPage = () => {
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

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
            const response = await signupUser(username, email, password);
            console.log(response);

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
                    newErrors.general = 'Signup failed!';
                }
            } else {
                console.error('Response is empty', response);
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
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit} className="signup-form">
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
                    {errors.general && <p className="error-text">{errors.general}</p>}
                    <button type="submit">Sign Up</button>
                </form>
                <p>Already have an account? <a href="/login">Login</a></p>
            </div>
        </div>
    );
};

export default SignupPage;
