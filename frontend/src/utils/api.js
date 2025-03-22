import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// const signup = async (userData) => {
//   try {
//     const response = await api.post('/users/signup', userData);
//     return response.data;
//   } catch (error) {
//     console.error("Signup error: ", error);
//     throw error; // Or handle the error as per your app's logic
//   }
// };


// // Login user
// const login = async (userData) => {
//   const response = await api.post('/users/login', userData);
//   return response.data;
// };

// Get all products
const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

// Add a product to wishlist
const addToWishlist = async (productId) => {
  const response = await api.post('/wishlist', { productId });
  return response.data;
};

// Remove a product from wishlist
const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};

// Get wishlist
const getWishlist = async () => {
  const response = await api.get('/wishlist');
  return response.data;
};

export default {
  // signup,
  // login,
  getProducts,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};