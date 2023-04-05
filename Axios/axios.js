import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://bloggie-blogs-api.onrender.com/api/v1'
});

export default instance