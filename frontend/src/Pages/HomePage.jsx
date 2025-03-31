"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Book, Laptop, Sofa, PenTool, Bike, MoreHorizontal, Heart, MessageCircle, Phone, Mail } from "lucide-react"
import CategoryCard from "../Components/CategoryCard"
import HowItWorks from "../Components/HowItWorksCard"
import "./HomePage.css"

const HomePage = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showContactInfo, setShowContactInfo] = useState(false)

  const [categories, setCategories] = useState([
    {
      icon: <Book size={32} />,
      name: "Books",
      count: "0 items",
      link: "/products/Books",
      description: "Textbooks, novels, study guides and more",
    },
    {
      icon: <Laptop size={32} />,
      name: "Electronics",
      count: "0 items",
      link: "/products/Electronics",
      description: "Laptops, phones, accessories and gadgets",
    },
    {
      icon: <Sofa size={32} />,
      name: "Furniture",
      count: "0 items",
      link: "/products/Furniture",
      description: "Chairs, tables, beds and storage solutions",
    },
    {
      icon: <PenTool size={32} />,
      name: "Supplies",
      count: "0 items",
      link: "/products/Supplies",
      description: "Stationery, art supplies and study materials",
    },
    {
      icon: <Bike size={32} />,
      name: "Transport",
      count: "0 items",
      link: "/products/Transport",
      description: "Bicycles, scooters and campus transport",
    },
    {
      icon: <MoreHorizontal size={32} />,
      name: "Others",
      count: "0 items",
      link: "/products/Others",
      description: "Sports equipment, musical instruments and more",
    },
  ])

  const testimonials = [
    {
      quote: "Really happy with Student MarketPlace helped me grow my business",
      rating: 5,
      author: "App Store Review",
      source: "App Store Review",
    },
    {
      quote: "This is a great app you can sell things fast. It's really easy to use",
      rating: 4,
      author: "Paridhi Gupta",
      source: "App Store Review",
    },
    {
      quote: "Great app. Always reliable.",
      rating: 5,
      author: "Shivansh Kumar",
      source: "Google Play Review",
    },
    {
      quote:
        "Gives you a clear process of communicating with the buyer and it's got some fabulous bargains and you can do this all for free.",
      rating: 5,
      author: "Ekta Pandit",
      source: "App Store Review",
    },
    {
      quote: "Love it. I made money from the first day!",
      rating: 5,
      author: "Rohan Singh",
      source: "Google Play Review",
    },
    {
      quote: "Excellent platform to buy and sell second hand goods. Very easy to use",
      rating: 5,
      author: "Kalyan Chandrasekar",
      source: "Google Play Review",
    },
  ]

  // Fetch all products and featured products when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch all products
        const productsResponse = await axios.get("http://localhost:5000/api/products")
        console.log("Products fetched:", productsResponse.data)

        if (Array.isArray(productsResponse.data)) {
          setProducts(productsResponse.data)

          // Update category counts
          const updatedCategories = [...categories]

          // Count products in each category
          const categoryCounts = {}
          productsResponse.data.forEach((product) => {
            const category = product.category
            categoryCounts[category] = (categoryCounts[category] || 0) + 1
          })

          // Update the categories array with counts
          updatedCategories.forEach((category, index) => {
            const count = categoryCounts[category.name] || 0
            updatedCategories[index] = {
              ...category,
              count: `${count} item${count !== 1 ? "s" : ""}`,
            }
          })

          setCategories(updatedCategories)
        }

        // Fetch featured products
        const featuredResponse = await axios.get("http://localhost:5000/api/products/featured")
        if (Array.isArray(featuredResponse.data)) {
          setFeaturedProducts(featuredResponse.data)
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load products")
        setLoading(false)
        toast.error("Failed to load products")
      }
    }

    fetchData()

    // Check if user is logged in
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)

    // Fetch wishlist if user is logged in
    if (token) {
      fetchWishlist(token)
    }
  }, [])

  // Fetch wishlist from API
  const fetchWishlist = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        // Extract product IDs from the wishlist
        const wishlistProductIds = response.data.data.products.map((product) => product._id)
        setWishlist(wishlistProductIds)
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error)
    }
  }

  // Function to get products by category
  const getProductsByCategory = (categoryName) => {
    return products.filter((product) => product.category === categoryName)
  }

  const handleAddToWishlist = async (product, e) => {
    e.stopPropagation() // Prevent the product click event

    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!isLoggedIn || !token) {
      toast.error("Please login to add items to your wishlist")
      navigate("/auth/login")
      return
    }

    // Check if product is already in wishlist
    const isInWishlist = wishlist.includes(product._id)

    try {
      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`http://localhost:5000/api/wishlist/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Update local state
        setWishlist(wishlist.filter((id) => id !== product._id))
        toast.success(`${product.title} removed from wishlist`)
      } else {
        // Add to wishlist
        await axios.post(
          `http://localhost:5000/api/wishlist/${product._id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        // Update local state
        setWishlist([...wishlist, product._id])
        toast.success(`${product.title} added to wishlist`)
      }
    } catch (error) {
      console.error("Error updating wishlist:", error)
      toast.error("Failed to update wishlist")
    }
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setShowContactInfo(false)
  }

  const handleCloseProductModal = () => {
    setSelectedProduct(null)
    setShowContactInfo(false)
  }

  const handleContactSeller = () => {
    if (!isLoggedIn) {
      toast.error("Please login to contact the seller")
      navigate("/auth/login")
      return
    }

    setShowContactInfo(true)
  }

  const handleStartChat = (sellerId) => {
    if (!isLoggedIn) {
      toast.error("Please login to chat with the seller")
      navigate("/auth/login")
      return
    }

    // Navigate to chat page with seller ID
    navigate(`/chat/${sellerId}`)
  }

  // Check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return wishlist.includes(productId)
  }

  const StarRating = ({ rating }) => {
    return (
      <div style={{ marginBottom: "12px" }}>
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            style={{
              color: index < rating ? "#48bb78" : "#e2e8f0",
              fontSize: "20px",
            }}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Categories Section */}
      <section style={{ padding: "48px 16px", backgroundColor: "#f9fafb" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "500", marginBottom: "32px" }}>Popular Categories</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "16px" }}>
            {categories.map((category) => (
              <Link
                to={`/products/category/${category.name}`}
                key={category.name}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <CategoryCard {...category} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section style={{ padding: "24px 16px", backgroundColor: "white" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "500" }}>Featured Listings</h2>
            <Link to="/browse" style={{ color: "#1d4ed8", textDecoration: "none" }}>
              View all
            </Link>
          </div>
          <div className="featured-grid">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div key={product._id} className="featured-card" onClick={() => handleProductClick(product)}>
                  <div className="featured-image-container">
                    {product.photos && product.photos.length > 0 ? (
                      <img
                        src={`http://localhost:5000/uploads/${product.photos[0]}`}
                        alt={product.title}
                        className="cropped-image"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "https://via.placeholder.com/200"
                        }}
                      />
                    ) : (
                      <div className="no-image-placeholder">No Image</div>
                    )}
                    <button
                      className={`wishlist-button ${isInWishlist(product._id) ? "active" : ""}`}
                      onClick={(e) => handleAddToWishlist(product, e)}
                      aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart size={20} color="#ff4d4d" fill={isInWishlist(product._id) ? "#ff4d4d" : "none"} />
                    </button>
                  </div>
                  <div className="featured-content">
                    <h3 className="featured-title">{product.title}</h3>
                    <p className="featured-price">₹{product.price}</p>
                    <p className="featured-description">{product.description.substring(0, 100)}...</p>
                    <div className="featured-seller">
                      <span className="seller-name">{product.seller?.name || "Anonymous Seller"}</span>
                      <span className="posted-date">{new Date(product.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No featured products available at the moment.</p>
            )}
          </div>
        </div>
      </section>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="modal" onClick={handleCloseProductModal}>
          <div className="modal-content product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={handleCloseProductModal}>
              ×
            </button>
            <div className="product-modal-content">
              {selectedProduct.photos && selectedProduct.photos.length > 0 ? (
                <img
                  src={`http://localhost:5000/uploads/${selectedProduct.photos[0]}`}
                  alt={selectedProduct.title}
                  className="product-modal-image"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "https://via.placeholder.com/400"
                  }}
                />
              ) : (
                <div className="no-image-placeholder product-modal-image">No Image</div>
              )}
              <div className="product-modal-details">
                <h2 className="product-modal-title">{selectedProduct.title}</h2>
                <p className="product-modal-price">₹{selectedProduct.price}</p>
                <p className="product-modal-condition">
                  <strong>Condition:</strong> {selectedProduct.condition}
                </p>
                <p className="product-modal-location">
                  <strong>Location:</strong> {selectedProduct.location}
                </p>
                <p className="product-modal-description">{selectedProduct.description}</p>

                {showContactInfo ? (
                  <div className="contact-info-container">
                    <h3>Contact Information</h3>
                    <div className="contact-methods">
                      {selectedProduct.phoneNumber && (
                        <div className="contact-method">
                          <Phone size={20} />
                          <span>{selectedProduct.phoneNumber}</span>
                        </div>
                      )}
                      {selectedProduct.email && (
                        <div className="contact-method">
                          <Mail size={20} />
                          <span>{selectedProduct.email}</span>
                        </div>
                      )}
                      {selectedProduct.seller && (
                        <button
                          className="btn btn-outline-primary mt-2"
                          onClick={() => handleStartChat(selectedProduct.seller._id)}
                        >
                          <MessageCircle size={20} className="me-2" />
                          Chat with Seller
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="product-modal-actions">
                    <button className="contact-seller-btn" onClick={handleContactSeller}>
                      Contact Seller
                    </button>
                    <button
                      className={`wishlist-btn ${isInWishlist(selectedProduct._id) ? "active" : ""}`}
                      onClick={(e) => handleAddToWishlist(selectedProduct, e)}
                    >
                      {isInWishlist(selectedProduct._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      <HowItWorks />

      {/* Testimonials Section */}
      <section style={{ padding: "80px 0", backgroundColor: "#f8f9fa" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", color: "#2d3748", marginBottom: "60px" }}>
            See what Student MarketPlace users are saying
          </h1>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  borderRadius: "12px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  padding: "24px",
                }}
              >
                <p style={{ fontSize: "1rem", color: "#4a5568", marginBottom: "16px" }}>"{testimonial.quote}"</p>
                <StarRating rating={testimonial.rating} />
                <div style={{ fontSize: "0.875rem" }}>
                  <span style={{ color: "#2d3748", fontWeight: "600" }}>{testimonial.author}</span>
                  <span style={{ color: "#718096", marginLeft: "4px" }}>· {testimonial.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

