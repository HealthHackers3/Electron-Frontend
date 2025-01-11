import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { loginUser } from '../api/authAPI';

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const location = useLocation();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        try {
            const response = await loginUser(email, password);
            console.log(response);

            if (response) {
                if (response.includes('Invalid username or password')) {
                    newErrors.general = 'Invalid username or password';
                    newErrors.email = true;
                    newErrors.password = true;
                } else if (response.includes('successful')) {
                    login();
                    navigate('/'); // Navigate to the next page if successful
                    return;
                } else {
                    newErrors.general = 'Signin failed!';
                }
            } else {
                console.error('Response is empty', response);
                newErrors.general = 'An unexpected error occurred. Please try again.';
            }
        } catch (error) {
            console.error('Login error:', error);
            newErrors.general = 'An unexpected error occurred. Please try again.';
        }

        setErrors(newErrors);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className={`form-group ${errors.email ? 'error' : ''}`}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className={`form-group ${errors.password ? 'error' : ''}`}>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {errors.general && <p className="error-message">{errors.general}</p>}
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <a href="/signup">Sign up</a></p>
            </div>
        </div>
    );
};

export default LoginPage;