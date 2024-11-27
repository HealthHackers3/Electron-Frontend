import React from 'react';
import axios from 'axios';

function Button() {
    const sendSignal = async () => {
        try {
            const response = await axios.post('http://localhost:5000/signal', {
                message: 'Hello from React!',
            });
            console.log('Response from server:', response.data);
        } catch (error) {
            console.error('Error sending signal:', error);
        }
    };

    return (
        <div>
            <button onClick={sendSignal}>Send Signal to Python</button>
        </div>
    );
}

export default Button;


