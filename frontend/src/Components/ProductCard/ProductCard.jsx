"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { FaHeart, FaRegHeart, FaShoppingCart, FaPhone } from "react-icons/fa"
import { useAuth } from "../Context/AuthContext"
import { toast } from "react-hot-toast"
import api from "../utils/api"

const ProductCard = ({ product }) => {
  const { user, isAuthenticated } = useAuth()
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [showContact, setShowContact] = useState(false)

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your wishlist")
      return
    }

    try {
      await api.post("/wishlist", {
        userId: user.id,
        productId: product._id,
      })
      setIsInWishlist(true)
      toast.success("Added to wishlist!")
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      toast.error("Failed to add to wishlist")
    }
  }

  const handleRemoveFromWishlist = async () => {
    if (!isAuthenticated) return

    try {
      await api.delete("/wishlist", {
        data: {
          userId: user.id,
          productId: product._id,
        },
      })
      setIsInWishlist(false)
      toast.success("Removed from wishlist!")
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast.error("Failed to remove from wishlist")
    }
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your cart")
      return
    }

    // Add to cart logic would go here
    toast.success("Added to cart!")
  }

  const toggleContact = () => {
    setShowContact(!showContact)
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link to={`/products/${product.category.toLowerCase()}/${product._id}`}>
        <div className="h-48 overflow-hidden">
          <img
            src={product.images[0] || "/placeholder-image.jpg"}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <Link to={`/products/${product.category.toLowerCase()}/${product._id}`}>
            <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
          </Link>
          <button
            onClick={isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
            className="text-red-500 hover:text-red-600 transition-colors"
          >
            {isInWishlist ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
          </button>
        </div>

        <p className="text-xl font-bold text-blue-600 mt-2">₹{product.price.toFixed(2)}</p>

        <div className="flex items-center mt-2">
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">{product.condition}</span>
          <span className="text-sm text-gray-600 ml-2">{product.location}</span>
        </div>

        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>

        <div className="flex justify-between mt-4">
          <button
            onClick={toggleContact}
            className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md transition-colors text-sm"
          >
            <FaPhone className="mr-1" /> Contact Seller
          </button>

          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md transition-colors text-sm"
          >
            <FaShoppingCart className="mr-1" /> Add to Cart
          </button>
        </div>

        {showContact && (
          <div className="mt-3 p-3 bg-gray-50 rounded-md">
            <p className="text-sm font-semibold">Seller: {product.sellerName}</p>
            <p className="text-sm">University: {product.sellerUniversity}</p>
            <p className="text-sm">Phone: {product.sellerPhone}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard

