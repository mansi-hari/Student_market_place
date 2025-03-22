import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Updated to the correct backend URL
});

export default instance;
