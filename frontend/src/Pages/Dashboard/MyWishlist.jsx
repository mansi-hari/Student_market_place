"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Row, Col, Card, Button } from "react-bootstrap"
import { FaHeart, FaEye, FaTrash } from "react-icons/fa"
import { toast } from "react-hot-toast"
import { Link } from "react-router-dom"

const MyWishlist = ({ refreshStats }) => {
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:5000/api/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        setWishlistItems(response.data.data.products)
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      toast.error("Failed to load your wishlist")
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.delete(`http://localhost:5000/api/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        setWishlistItems(wishlistItems.filter((item) => item._id !== productId))
        toast.success("Item removed from wishlist")

        // Refresh stats after removal
        if (refreshStats) refreshStats()
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast.error("Failed to remove item from wishlist")
    }
  }

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <FaHeart />
        </div>
        <h3>Your Wishlist is Empty</h3>
        <p>You haven't added any items to your wishlist yet.</p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="my-wishlist">
      <h3 className="mb-4">My Wishlist</h3>

      <Row>
        {wishlistItems.map((product) => (
          <Col lg={4} md={6} className="mb-4" key={product._id}>
            <Card className="product-card h-100">
              <div className="product-image">
                {product.photos && product.photos.length > 0 ? (
                  <img
                    src={`http://localhost:5000/uploads/${product.photos[0]}`}
                    alt={product.title}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "https://via.placeholder.com/300x200"
                    }}
                  />
                ) : (
                  <div className="d-flex justify-content-center align-items-center h-100 bg-light">No Image</div>
                )}
                <div className="product-actions">
                  <Button variant="light" size="sm" as={Link} to={`/product/${product._id}`} title="View Product">
                    <FaEye />
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => removeFromWishlist(product._id)}
                    title="Remove from Wishlist"
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
              <div className="product-info">
                <h5 className="product-title">{product.title}</h5>
                <p className="product-price">₹{product.price}</p>
                <div className="product-meta">
                  <span>{product.condition}</span>
                  <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default MyWishlist

