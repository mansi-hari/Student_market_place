"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-hot-toast"
import { ShoppingBag, Trash2 } from "lucide-react"
import "./WishlistPage.css"

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        toast.error("Please log in to view your wishlist")
        navigate("/auth/login")
        return
      }

      try {
        setLoading(true)
        const response = await axios.get("http://localhost:5000/api/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data.success) {
          console.log("Wishlist data:", response.data)
          setWishlistItems(response.data.data.products)
        } else {
          toast.error(response.data.message || "Failed to load wishlist")
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error)
        toast.error("Failed to load wishlist")
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [navigate])

  const handleRemoveFromWishlist = async (productId) => {
    const token = localStorage.getItem("token")

    try {
      const response = await axios.delete(`http://localhost:5000/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setWishlistItems(wishlistItems.filter((item) => item._id !== productId))
        toast.success("Removed from wishlist")
      } else {
        toast.error(response.data.message || "Failed to remove item")
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast.error("Failed to remove item")
    }
  }

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`)
  }

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist-page container my-5">
      <h2 className="mb-4">Your Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <div className="text-center empty-wishlist">
          <ShoppingBag size={64} className="mb-3 text-muted" />
          <h3>Your wishlist is empty</h3>
          <p className="text-muted">Save items you like by clicking the heart icon on any product</p>
          <Link to="/products" className="btn btn-primary mt-3">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="row">
          {wishlistItems.map((item) => (
            <div key={item._id} className="col-md-4 col-sm-6 mb-4">
              <div className="card h-100 wishlist-card">
                <div className="wishlist-image-container">
                  {item.photos && item.photos.length > 0 ? (
                    <img
                      src={`http://localhost:5000/uploads/${item.photos[0]}`}
                      className="card-img-top wishlist-image"
                      alt={item.title}
                      onClick={() => handleViewProduct(item._id)}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "https://via.placeholder.com/150"
                      }}
                    />
                  ) : (
                    <div className="no-image-placeholder" onClick={() => handleViewProduct(item._id)}>
                      No Image
                    </div>
                  )}
                  <button
                    className="remove-wishlist-btn"
                    onClick={() => handleRemoveFromWishlist(item._id)}
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text price">₹{item.price}</p>
                  <p className="card-text condition">
                    <small className="text-muted">Condition: {item.condition}</small>
                  </p>
                  <p className="card-text location">
                    <small className="text-muted">{item.location}</small>
                  </p>
                  <div className="d-flex justify-content-between mt-3">
                    <button className="btn btn-primary" onClick={() => handleViewProduct(item._id)}>
                      View Details
                    </button>
                    <button className="btn btn-outline-danger" onClick={() => handleRemoveFromWishlist(item._id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WishlistPage
