import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/auth/login" // Changed from /login
    }
    return Promise.reject(error)
  },
)

// Signup function
const signup = async (userData) => {
  try {
    const response = await api.post("/auth/signup", userData) // Changed from /users/signup
    return response.data
  } catch (error) {
    console.error("Signup error: ", error)
    throw error
  }
}

// Login user
const login = async (userData) => {
  const response = await api.post("/auth/login", userData) // Changed from /users/login
  return response.data
}

// Get all products
const getProducts = async () => {
  const response = await api.get("/products")
  return response.data
}

// Create a new product (sell page)
const createProduct = async (productData) => {
  try {
    const response = await api.post("/products", productData) // Send product data to backend
    return response.data
  } catch (error) {
    console.error("Create product error: ", error)
    throw error
  }
}

// Add a product to wishlist
const addToWishlist = async (productId) => {
  const response = await api.post("/wishlist", { productId })
  return response.data
}

// Remove a product from wishlist
const removeFromWishlist = async (productId) => {
  const response = await api.delete(`/wishlist/${productId}`)
  return response.data
}

// Get wishlist
const getWishlist = async () => {
  const response = await api.get("/wishlist")
  return response.data
}

// Check if a product is in the wishlist
const checkWishlist = async (productId) => {
  const response = await api.get(`/wishlist/check/${productId}`)
  return response.data
}

// Clear wishlist
const clearWishlist = async () => {
  const response = await api.delete("/wishlist/clear")
  return response.data
}

// Get current user details
const getCurrentUser = async () => {
  const response = await api.get("/auth/me") // Adjust this endpoint based on your backend
  return response.data
}

export default {
  signup,
  login,
  getProducts,
  createProduct,  // Add this new function
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlist,
  clearWishlist,
  getCurrentUser,
}
