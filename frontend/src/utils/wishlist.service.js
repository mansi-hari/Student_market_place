import api from './api';

/**
 * Get user's wishlist
 * @returns {Promise} - Promise resolving to wishlist data
 */
export const getWishlist = async () => {
  try {
    const response = await api.get('/wishlist');
    return response.data.data || { products: [] };
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    throw error;
  }
};

/**
 * Add product to wishlist
 * @param {string} productId - Product ID to add
 * @returns {Promise} - Promise resolving to success message
 */
export const addToWishlist = async (productId) => {
  try {
    const response = await api.post(`/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

/**
 * Remove product from wishlist
 * @param {string} productId - Product ID to remove
 * @returns {Promise} - Promise resolving to success message
 */
export const removeFromWishlist = async (productId) => {
  try {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

/**
 * Clear wishlist
 * @returns {Promise} - Promise resolving to success message
 */
export const clearWishlist = async () => {
  try {
    const response = await api.delete('/wishlist');
    return response.data;
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    throw error;
  }
};

/**
 * Check if product is in wishlist
 * @param {string} productId - Product ID to check
 * @returns {Promise<boolean>} - Promise resolving to boolean
 */
export const checkWishlist = async (productId) => {
  try {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data.data.isInWishlist;
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};