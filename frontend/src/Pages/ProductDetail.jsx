"use client"

import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"
import { FaMapMarkerAlt, FaHeart, FaRegHeart, FaShare, FaArrowLeft } from "react-icons/fa"
import "./ProductDetail.css"

const ProductDetail = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [inWishlist, setInWishlist] = useState(false)
  const [similarProducts, setSimilarProducts] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`)
        setProduct(response.data)

        // Check if product is in wishlist
        checkWishlistStatus(response.data._id)

        // Fetch similar products
        fetchSimilarProducts(response.data.category)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching product", error)
        setError("Failed to load product details")
        setLoading(false)
        toast.error("Failed to load product details")
      }
    }

    fetchProduct()
  }, [productId])

  const checkWishlistStatus = async (id) => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const response = await axios.get(`http://localhost:5000/api/wishlist/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setInWishlist(response.data.isInWishlist)
    } catch (error) {
      console.error("Error checking wishlist status:", error)
    }
  }

  const fetchSimilarProducts = async (category) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products?category=${category}&limit=4`)
      // Filter out the current product
      const filtered = response.data.filter((p) => p._id !== productId)
      setSimilarProducts(filtered.slice(0, 3))
    } catch (error) {
      console.error("Error fetching similar products:", error)
    }
  }

  const toggleWishlist = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please login to add items to wishlist")
      navigate("/auth/login")
      return
    }

    try {
      if (inWishlist) {
        await axios.delete(`http://localhost:5000/api/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setInWishlist(false)
        toast.success("Removed from wishlist")
      } else {
        await axios.post(
          `http://localhost:5000/api/wishlist/${productId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        setInWishlist(true)
        toast.success("Added to wishlist")
      }
    } catch (error) {
      console.error("Error updating wishlist:", error)
      toast.error("Failed to update wishlist")
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.title,
          text: `Check out this ${product.title} on Student Marketplace`,
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.log("Error sharing:", error))
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }

  const contactSeller = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Please login to contact the seller")
      navigate("/auth/login")
      return
    }

    // Navigate to chat with seller
    navigate(`/chat/${product.seller._id}`)
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading product details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/products" className="btn btn-primary">
          <FaArrowLeft className="me-2" />
          Back to Products
        </Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          Product not found
        </div>
        <Link to="/products" className="btn btn-primary">
          <FaArrowLeft className="me-2" />
          Back to Products
        </Link>
      </div>
    )
  }

  return (
    <div className="container mt-4 mb-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/products">Products</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.title}
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Product Images */}
        <div className="col-md-6 mb-4">
          <div className="product-images-container">
            <div className="main-image-container">
              {product.photos && product.photos.length > 0 ? (
                <img
                  src={`http://localhost:5000/${product.photos[activeImage]}`}
                  alt={product.title}
                  className="main-product-image"
                />
              ) : (
                <div className="no-image-placeholder">
                  <span>No Image Available</span>
                </div>
              )}
            </div>

            {product.photos && product.photos.length > 1 && (
              <div className="thumbnail-container">
                {product.photos.map((photo, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${activeImage === index ? "active" : ""}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img src={`http://localhost:5000/${photo}`} alt={`${product.title} - ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="col-md-6">
          <h1 className="product-title">{product.title}</h1>

          <div className="product-price-container">
            <span className="product-price">₹{product.price}</span>
            {product.negotiable && <span className="negotiable-badge">Negotiable</span>}
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Condition:</span>
              <span className="meta-value">{product.condition}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <span className="meta-value">{product.category}</span>
            </div>
            <div className="meta-item location-meta">
              <FaMapMarkerAlt className="location-icon" />
              <span className="meta-value">{product.location}</span>
              {product.pincode && <span className="pincode">({product.pincode})</span>}
            </div>
          </div>

          <div className="product-actions">
            <button className="btn btn-primary btn-lg contact-btn" onClick={contactSeller}>
              Contact Seller
            </button>
            <button
              className={`btn btn-outline-danger btn-lg wishlist-btn ${inWishlist ? "active" : ""}`}
              onClick={toggleWishlist}
            >
              {inWishlist ? (
                <>
                  <FaHeart className="me-2" />
                  In Wishlist
                </>
              ) : (
                <>
                  <FaRegHeart className="me-2" />
                  Add to Wishlist
                </>
              )}
            </button>
            <button className="btn btn-outline-secondary share-btn" onClick={handleShare}>
              <FaShare />
            </button>
          </div>

          <div className="product-description">
            <h4>Description</h4>
            <p>{product.description}</p>
          </div>

          {product.tags && (
            <div className="product-tags">
              <h4>Tags</h4>
              <div className="tags-container">
                {product.tags.split(",").map((tag, index) => (
                  <span key={index} className="product-tag">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="seller-info">
            <h4>Seller Information</h4>
            <div className="seller-card">
              <div className="seller-avatar">
                {product.seller?.profileImage ? (
                  <img src={`http://localhost:5000/${product.seller.profileImage}`} alt={product.seller.name} />
                ) : (
                  <div className="avatar-placeholder">{product.seller?.name?.charAt(0) || "S"}</div>
                )}
              </div>
              <div className="seller-details">
                <h5>{product.seller?.name || "Anonymous"}</h5>
                <p className="seller-location">
                  <FaMapMarkerAlt className="me-1" />
                  {product.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="similar-products mt-5">
          <h3>Similar Products</h3>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {similarProducts.map((similarProduct) => (
              <div key={similarProduct._id} className="col">
                <div className="card h-100 product-card">
                  <div className="position-relative">
                    {similarProduct.photos && similarProduct.photos.length > 0 ? (
                      <img
                        src={`http://localhost:5000/${similarProduct.photos[0]}`}
                        className="card-img-top similar-product-image"
                        alt={similarProduct.title}
                      />
                    ) : (
                      <div className="card-img-top similar-product-image-placeholder">No Image</div>
                    )}
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{similarProduct.title}</h5>
                    <p className="card-text product-price">₹{similarProduct.price}</p>
                    <Link to={`/product/${similarProduct._id}`} className="btn btn-primary w-100">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail

