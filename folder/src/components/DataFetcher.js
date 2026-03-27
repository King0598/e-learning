// src/components/DataFetcher.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

function DataFetcher() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/hello');
            setData(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const sendData = async () => {
        try {
            const response = await api.post('/data', {
                message: 'Hello from React',
                timestamp: new Date().toISOString()
            });
            console.log('Response:', response.data);
        } catch (err) {
            console.error('Error sending data:', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Data from Spring Boot: {data}</h1>
            <button onClick={sendData}>Send Data to Backend</button>
        </div>
    );
}

export default DataFetcher;