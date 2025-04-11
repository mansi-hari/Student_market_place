import api from "./api"

/**
 * Get all categories
 * @returns {Promise} - Promise resolving to categories array
 */
export const getCategories = async () => {
  try {
    const response = await api.get("/categories")
    return response.data.data || []
  } catch (error) {
    console.error("Error fetching categories:", error)
    // Return default categories if API fails
    return [
      { name: "Books" },
      { name: "Electronics" },
      { name: "Furniture" },
      { name: "Appliances" },
      { name: "Bicycles" },
      { name: "Transport" },
      { name: "Sports & Fitness" },
      { name: "Services" },
      { name: "Stationery" },
    ]
  }
}

/**
 * Get category by ID
 * @param {string} id - Category ID
 * @returns {Promise} - Promise resolving to category object
 */
export const getCategoryById = async (id) => {
  try {
    const response = await api.get(`/categories/${id}`)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error)
    throw error
  }
}

