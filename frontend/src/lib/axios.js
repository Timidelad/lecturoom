import axios from "axios";

const instance = axios.create({
    // baseURL: 'https://lecturoombackend.onrender.com/api',
    baseURL: 'http://localhost:5000',
    withCredentials: true,
});

export default instance;