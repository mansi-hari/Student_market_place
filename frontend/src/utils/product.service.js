import api from "./api"

/**
 * Create a new product listing
 * @param {Object} productData - Product data to be submitted
 * @returns {Promise} - Promise resolving to the created product
 */
export const createProduct = async (productData) => {
  try {
    // Create FormData for file uploads
    const formData = new FormData()

    // Add text fields
    Object.keys(productData).forEach((key) => {
      if (key !== "photos" && key !== "tags") {
        formData.append(key, productData[key])
      }
    })

    // Add tags as JSON string
    if (productData.tags && Array.isArray(productData.tags)) {
      formData.append("tags", JSON.stringify(productData.tags))
    }

    // Add photos
    if (productData.photos && productData.photos.length) {
      productData.photos.forEach((photo) => {
        formData.append("photos", photo)
      })
    }

    const response = await api.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

/**
 * Get all products with optional filtering
 * @param {Object} params - Query parameters for filtering
 * @returns {Promise} - Promise resolving to products array
 */
export const getProducts = async (params = {}) => {
  try {
    const response = await api.get("/products", { params })
    return response.data
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

/**
 * Get a product by ID
 * @param {string} id - Product ID
 * @returns {Promise} - Promise resolving to product object
 */
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error)
    throw error
  }
}

/**
 * Update a product
 * @param {string} id - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise} - Promise resolving to updated product
 */
export const updateProduct = async (id, productData) => {
  try {
    // Create FormData for file uploads
    const formData = new FormData()

    // Add text fields
    Object.keys(productData).forEach((key) => {
      if (key !== "photos" && key !== "tags") {
        formData.append(key, productData[key])
      }
    })

    // Add tags as JSON string
    if (productData.tags && Array.isArray(productData.tags)) {
      formData.append("tags", JSON.stringify(productData.tags))
    }

    // Add photos
    if (productData.photos && productData.photos.length) {
      productData.photos.forEach((photo) => {
        if (typeof photo === "string") {
          // Existing photo URLs
          formData.append("existingPhotos", photo)
        } else {
          // New photo files
          formData.append("photos", photo)
        }
      })
    }

    const response = await api.put(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data
  } catch (error) {
    console.error(`Error updating product ${id}:`, error)
    throw error
  }
}

/**
 * Delete a product
 * @param {string} id - Product ID
 * @returns {Promise} - Promise resolving to deletion result
 */
export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/products/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error)
    throw error
  }
}

/**
 * Get user's products
 * @returns {Promise} - Promise resolving to user's products array
 */
export const getUserProducts = async () => {
  try {
    const response = await api.get("/products/user")
    return response.data
  } catch (error) {
    console.error("Error fetching user products:", error)
    throw error
  }
}

