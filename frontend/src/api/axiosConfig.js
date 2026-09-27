import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://fashionshop-e972.onrender.com/api', 
});

export default api;