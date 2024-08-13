import React, { useEffect, useState } from 'react';

const HelloWorld = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const response = await fetch('http://localhost:4000/hello');
                const data = await response.json();
                if (data && data.message) {
                    setMessage(data.message);
                } else {
                    setMessage("No message found in the database");
                }
            } catch (error) {
                console.error('Error fetching message:', error);
                setMessage("Error fetching message");
            }
        };

        fetchMessage();
    }, []);

    return (
        <div>
            <h1>Hello, World!</h1>
            <h1>{message}</h1>
            
        </div>
    );
};

export default HelloWorld;