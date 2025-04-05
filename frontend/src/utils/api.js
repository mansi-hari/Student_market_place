import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);

// Define all API methods as named exports
export const signup = async (userData) => {
  try {
    const response = await api.post("/auth/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Signup error: ", error);
    throw error;
  }
};

export const login = async (userData) => {
  const response = await api.post("/auth/login", userData);
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get("/products");
  return response.data;
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post("/products", productData);
    return response.data;
  } catch (error) {
    console.error("Create product error: ", error);
    throw error;
  }
};

export const addToWishlist = async (productId) => {
  const response = await api.post("/wishlist", { productId });
  return response.data;
};

export const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/wishlist/${productId}`);
  return response.data;
};

export const getWishlist = async () => {
  const response = await api.get("/wishlist");
  return response.data;
};

export const checkWishlist = async (productId) => {
  const response = await api.get(`/wishlist/check/${productId}`);
  return response.data;
};

export const clearWishlist = async () => {
  const response = await api.delete("/wishlist/clear");
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  console.log("getCurrentUser response:", response.data); // Debug
  return response.data;
};

export const getUserDashboard = async () => {
  const response = await api.get("/users/dashboard");
  console.log("getUserDashboard response:", response.data); // Debug
  return response.data;
};