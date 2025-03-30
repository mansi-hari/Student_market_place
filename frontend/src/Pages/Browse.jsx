"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { Heart, Grid, List, MapPin, X, MessageCircle, Phone, Mail } from "lucide-react"
import axios from "axios"
import { toast } from "react-hot-toast"
import "./Browse.css"

const Browse = () => {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState("grid")
  const [favorites, setFavorites] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [sortOption, setSortOption] = useState("newest")
  const [displayProducts, setDisplayProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [categoryTitle, setCategoryTitle] = useState("All Products")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showContactInfo, setShowContactInfo] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [selectedConditions, setSelectedConditions] = useState({
    New: false,
    "Like New": false,
    Good: false,
    Used: false,
  })

  // Get category from URL parameters
  const { category } = useParams()

  const statesAndCities = {
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Karnataka: ["Bangalore", "Mysore"],
    Delhi: ["New Delhi"],
    "Uttar Pradesh": ["Lucknow", "Kanpur"],
    "Tamil Nadu": ["Chennai", "Coimbatore"],
    "West Bengal": ["Kolkata", "Durgapur"],
    Gujarat: ["Ahmedabad", "Surat"],
    Rajasthan: ["Jaipur", "Udaipur"],
  }

  // Load products and check login status
  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)

    // Load favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem("wishlist") || "[]")
    setFavorites(savedFavorites)

    fetchProducts()
  }, [category])

  // Fetch products based on category
  const fetchProducts = async () => {
    try {
      setLoading(true)
      let url = "http://localhost:5000/api/products"

      if (category) {
        url = `http://localhost:5000/api/products/category/${category}`
        // Set a formatted title for the category
        const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1)
        setCategoryTitle(formattedCategory)
      } else {
        setCategoryTitle("All Products")
      }

      const response = await axios.get(url)
      console.log("Products fetched:", response.data)

      if (Array.isArray(response.data)) {
        setAllProducts(response.data)
        applyFilters(response.data)
      } else {
        console.error("Invalid data format received:", response.data)
        setError("Invalid data format received from server")
      }

      setLoading(false)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products")
      setLoading(false)
      toast.error("Failed to load products")
    }
  }

  // Apply filters and sorting
  const applyFilters = (products = allProducts) => {
    let filteredProducts = [...products]

    // Filter by location
    if (selectedState) {
      filteredProducts = filteredProducts.filter(
        (product) => product.location && product.location.includes(selectedState),
      )

      if (selectedCity) {
        filteredProducts = filteredProducts.filter(
          (product) => product.location && product.location.includes(selectedCity),
        )
      }
    }

    // Filter by price range
    if (priceRange.min !== "") {
      filteredProducts = filteredProducts.filter((product) => product.price >= Number(priceRange.min))
    }

    if (priceRange.max !== "") {
      filteredProducts = filteredProducts.filter((product) => product.price <= Number(priceRange.max))
    }

    // Filter by condition
    const selectedConditionsList = Object.keys(selectedConditions).filter((condition) => selectedConditions[condition])

    if (selectedConditionsList.length > 0) {
      filteredProducts = filteredProducts.filter((product) => selectedConditionsList.includes(product.condition))
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        filteredProducts.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filteredProducts.sort((a, b) => b.price - a.price)
        break
      case "newest":
      default:
        filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    setDisplayProducts(filteredProducts)
  }

  // Handle price range changes
  const handlePriceChange = (e) => {
    const { name, value } = e.target
    setPriceRange((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle condition checkbox changes
  const handleConditionChange = (condition) => {
    setSelectedConditions((prev) => ({
      ...prev,
      [condition]: !prev[condition],
    }))
  }

  // Apply filters when filter values change
  useEffect(() => {
    applyFilters()
  }, [selectedState, selectedCity, priceRange, selectedConditions, sortOption])

  // Toggle favorite status
  const toggleFavorite = (product, e) => {
    e.stopPropagation()

    if (!isLoggedIn) {
      toast.error("Please login to add items to your wishlist")
      navigate("/auth/login")
      return
    }

    const isInFavorites = favorites.some((item) => item._id === product._id)

    if (isInFavorites) {
      // Remove from favorites
      const updatedFavorites = favorites.filter((item) => item._id !== product._id)
      setFavorites(updatedFavorites)
      localStorage.setItem("wishlist", JSON.stringify(updatedFavorites))
      toast.success(`${product.title} removed from wishlist`)
    } else {
      // Add to favorites
      const updatedFavorites = [...favorites, product]
      setFavorites(updatedFavorites)
      localStorage.setItem("wishlist", JSON.stringify(updatedFavorites))
      toast.success(`${product.title} added to wishlist`)
    }
  }

  const handleImageClick = (product) => {
    setSelectedProduct(product)
    setShowContactInfo(false)
  }

  const closeOptions = () => {
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

  // Check if a product is in favorites
  const isInFavorites = (productId) => {
    return favorites.some((item) => item._id === productId)
  }

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="browse-page">
      <aside className="filters">
        <h3>Filters</h3>
        <div className="filter-section">
          <h4>Location</h4>
          <select onChange={(e) => setSelectedState(e.target.value)} value={selectedState} className="form-select mb-2">
            <option value="">Select State</option>
            {Object.keys(statesAndCities).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          {selectedState && (
            <select onChange={(e) => setSelectedCity(e.target.value)} value={selectedCity} className="form-select">
              <option value="">Select City</option>
              {statesAndCities[selectedState].map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="filter-section">
          <h4>Price Range</h4>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min"
              min="0"
              name="min"
              value={priceRange.min}
              onChange={handlePriceChange}
              className="form-control"
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max"
              min="0"
              name="max"
              value={priceRange.max}
              onChange={handlePriceChange}
              className="form-control"
            />
          </div>
        </div>

        <div className="filter-section">
          <h4>Condition</h4>
          <div className="checkbox-group">
            {Object.keys(selectedConditions).map((condition) => (
              <div className="form-check" key={condition}>
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`condition-${condition}`}
                  checked={selectedConditions[condition]}
                  onChange={() => handleConditionChange(condition)}
                />
                <label className="form-check-label" htmlFor={`condition-${condition}`}>
                  {condition}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-outline-secondary w-100 mt-3"
          onClick={() => {
            setSelectedState("")
            setSelectedCity("")
            setPriceRange({ min: "", max: "" })
            setSelectedConditions({
              New: false,
              "Like New": false,
              Good: false,
              Used: false,
            })
            applyFilters()
          }}
        >
          Reset Filters
        </button>
      </aside>

      <main className="main-content">
        <h2 className="category-title">{categoryTitle}</h2>

        <div className="sort-options">
          <select onChange={(e) => setSortOption(e.target.value)} value={sortOption} className="form-select">
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <div className="view-toggles">
            <button
              onClick={() => setViewMode("grid")}
              className={`btn btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-outline-primary"}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`btn btn-sm ${viewMode === "list" ? "btn-primary" : "btn-outline-primary"}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        <div className={`products-container ${viewMode}`}>
          {displayProducts.length > 0 ? (
            displayProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image" onClick={() => handleImageClick(product)}>
                  {product.photos && product.photos.length > 0 ? (
                    <img
                      src={`http://localhost:5000/uploads/${product.photos[0]}`}
                      alt={product.title}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "https://via.placeholder.com/200"
                      }}
                    />
                  ) : (
                    <div className="no-image-placeholder">No Image</div>
                  )}
                  <div className="product-condition">{product.condition}</div>
                  <button
                    className={`favorite-btn ${isInFavorites(product._id) ? "active" : ""}`}
                    onClick={(e) => toggleFavorite(product, e)}
                  >
                    <Heart fill={isInFavorites(product._id) ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p className="product-price">₹{product.price}</p>
                  <p className="product-location">
                    <MapPin size={16} /> {product.location}
                  </p>
                  {viewMode === "list" && <p className="product-description">{product.description}</p>}
                  <div className="product-meta">
                    <span className="product-date">{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="product-actions">
                    <button className="btn btn-sm btn-primary" onClick={() => handleImageClick(product)}>
                      View Details
                    </button>
                    <Link to={`/product/${product._id}`} className="btn btn-sm btn-outline-primary">
                      Full Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <p>No products found for this category. Try adjusting your filters.</p>
              <Link to="/sell" className="btn btn-primary mt-3">
                List an Item
              </Link>
            </div>
          )}
        </div>
      </main>

      {selectedProduct && (
        <div className="product-options-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={closeOptions}>
              <X size={24} />
            </button>
            <div className="modal-product-image">
              {selectedProduct.photos && selectedProduct.photos.length > 0 ? (
                <img
                  src={`http://localhost:5000/uploads/${selectedProduct.photos[0]}`}
                  alt={selectedProduct.title}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "https://via.placeholder.com/400"
                  }}
                />
              ) : (
                <div className="no-image-placeholder">No Image</div>
              )}
            </div>
            <div className="modal-product-details">
              <h2>{selectedProduct.title}</h2>
              <p className="modal-product-price">₹{selectedProduct.price}</p>
              <p className="modal-product-condition">
                <strong>Condition:</strong> {selectedProduct.condition}
              </p>
              <p className="modal-product-location">
                <MapPin size={16} /> {selectedProduct.location}
              </p>
              <p className="modal-product-description">{selectedProduct.description}</p>

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
                <div className="modal-actions">
                  <button className="contact-seller" onClick={handleContactSeller}>
                    Contact Seller
                  </button>
                  <button
                    className={`add-to-favorites ${isInFavorites(selectedProduct._id) ? "active" : ""}`}
                    onClick={(e) => toggleFavorite(selectedProduct, e)}
                  >
                    {isInFavorites(selectedProduct._id) ? "Remove from Favorites" : "Add to Favorites"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Browse

