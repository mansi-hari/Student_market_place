"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { Heart, Grid, List, MapPin, X } from "lucide-react"
import "./Browse.css"

// Import images
import chairImg from "../Components/Assets/DeskChair.png"
import laptopImg from "../Components/Assets/Laptop3.png"
import textbookImg from "../Components/Assets/books.png"
import ShivanshImg from "../Components/Assets/Shivansh.jpg"
import ParidhiImg from "../Components/Assets/Paridhi.jpg"
import SumitImg from "../Components/Assets/Sumit.jpg"

// Category-specific product data
const categoryProducts = {
  books: [
    {
      id: 101,
      title: "Engineering Mathematics Textbook",
      price: 450,
      image: textbookImg,
      seller: { name: "Sumit Singh", avatar: SumitImg },
      location: "Pune, Maharashtra",
      condition: "Like New",
      description:
        "Comprehensive engineering mathematics textbook covering calculus, linear algebra, and differential equations. Perfect for first and second year engineering students. Minimal highlighting, all pages intact.",
      postedDate: "2 weeks ago",
      category: "books",
    },
    {
      id: 102,
      title: "Data Structures Textbook",
      price: 350,
      image: textbookImg,
      seller: { name: "Paridhi Gupta", avatar: ParidhiImg },
      location: "Mumbai, Maharashtra",
      condition: "Good",
      description:
        "Essential textbook for computer science students. Covers all fundamental data structures and algorithms with practical examples. Some notes in margins but very clean overall.",
      postedDate: "1 month ago",
      category: "books",
    },
    {
      id: 103,
      title: "Computer Networks Bundle",
      price: 500,
      image: textbookImg,
      seller: { name: "Shivansh Kumar", avatar: ShivanshImg },
      location: "Bangalore, Karnataka",
      condition: "Excellent",
      description:
        "Set of 3 computer networking books including one on TCP/IP protocols. Perfect for IT and CS students. Barely used, like new condition.",
      postedDate: "3 days ago",
      category: "books",
    },
  ],
  electronics: [
    {
      id: 201,
      title: "Dell XPS 13 Laptop",
      price: 15000,
      image: laptopImg,
      seller: { name: "Shivansh Kumar", avatar: ShivanshImg },
      location: "Pune, Maharashtra",
      condition: "Excellent",
      description:
        "Dell XPS 13 with Intel i5 processor, 8GB RAM, 256GB SSD. Battery life is still excellent (5-6 hours). Includes charger and laptop sleeve. Minor scratch on bottom case.",
      postedDate: "1 week ago",
      category: "electronics",
    },
    {
      id: 202,
      title: "HP Victus Gaming Laptop",
      price: 20000,
      image: laptopImg,
      seller: { name: "Sumit Singh", avatar: SumitImg },
      location: "Mumbai, Maharashtra",
      condition: "Like New",
      description:
        "HP Victus with RTX 3050, 16GB RAM, 512GB SSD. Perfect for gaming and design work. Only 6 months old, selling because I'm upgrading. Comes with original box and accessories.",
      postedDate: "5 days ago",
      category: "electronics",
    },
    {
      id: 203,
      title: "Wireless Mouse and Keyboard Combo",
      price: 1200,
      image: laptopImg, // Replace with appropriate image
      seller: { name: "Paridhi Gupta", avatar: ParidhiImg },
      location: "Bangalore, Karnataka",
      condition: "Good",
      description:
        "Logitech wireless keyboard and mouse combo. Works perfectly, batteries included. Great for students who need a reliable setup for assignments and projects.",
      postedDate: "2 weeks ago",
      category: "electronics",
    },
  ],
  furniture: [
    {
      id: 301,
      title: "Ergonomic Desk Chair",
      price: 5000,
      image: chairImg,
      seller: { name: "Shivansh Kumar", avatar: ShivanshImg },
      location: "Mumbai, Maharashtra",
      condition: "Good",
      description:
        "Comfortable ergonomic chair perfect for long study sessions. Adjustable height and lumbar support. Some minor wear on the armrests but otherwise in great condition.",
      postedDate: "3 weeks ago",
      category: "furniture",
    },
    {
      id: 302,
      title: "Study Table with Bookshelf",
      price: 3500,
      image: chairImg, // Replace with appropriate image
      seller: { name: "Sumit Singh", avatar: SumitImg },
      location: "Pune, Maharashtra",
      condition: "Excellent",
      description:
        "Wooden study table with attached bookshelf. Spacious desktop and multiple shelves for books and supplies. Easy to assemble and very sturdy. Moving out so need to sell quickly.",
      postedDate: "1 month ago",
      category: "furniture",
    },
    {
      id: 303,
      title: "Foldable Bedside Table",
      price: 1200,
      image: chairImg, // Replace with appropriate image
      seller: { name: "Paridhi Gupta", avatar: ParidhiImg },
      location: "Delhi",
      condition: "Like New",
      description:
        "Compact bedside table that can be folded when not in use. Perfect for small hostel rooms. Has a drawer for storage and cup holder. Only used for one semester.",
      postedDate: "2 weeks ago",
      category: "furniture",
    },
  ],
  supplies: [
    {
      id: 401,
      title: "Scientific Calculator",
      price: 1200,
      image: textbookImg, // Replace with appropriate image
      seller: { name: "Sumit Singh", avatar: SumitImg },
      location: "Bangalore, Karnataka",
      condition: "Excellent",
      description:
        "Casio FX-991EX scientific calculator. All functions working perfectly. Essential for engineering and science students. Includes protective case and manual.",
      postedDate: "1 week ago",
      category: "supplies",
    },
    {
      id: 402,
      title: "Drawing Kit for Architecture Students",
      price: 800,
      image: textbookImg, // Replace with appropriate image
      seller: { name: "Paridhi Gupta", avatar: ParidhiImg },
      location: "Mumbai, Maharashtra",
      condition: "Good",
      description:
        "Complete drawing kit with drafting board, T-square, set squares, scales, and drawing instruments. Perfect for architecture and design students.",
      postedDate: "3 weeks ago",
      category: "supplies",
    },
    {
      id: 403,
      title: "Premium Notebook Bundle",
      price: 350,
      image: textbookImg, // Replace with appropriate image
      seller: { name: "Shivansh Kumar", avatar: ShivanshImg },
      location: "Pune, Maharashtra",
      condition: "New",
      description:
        "Set of 5 premium notebooks with graph paper, perfect for engineering notes. Thick paper prevents ink bleed-through. Never used, still in original packaging.",
      postedDate: "4 days ago",
      category: "supplies",
    },
  ],
  transport: [
    {
      id: 501,
      title: "Mountain Bike",
      price: 8000,
      image: chairImg, // Replace with appropriate image
      seller: { name: "Shivansh Kumar", avatar: ShivanshImg },
      location: "Pune, Maharashtra",
      condition: "Good",
      description:
        "21-speed mountain bike, perfect for campus commuting. Recently serviced with new brake pads and tuned gears. Includes bike lock and helmet.",
      postedDate: "2 weeks ago",
      category: "transport",
    },
    {
      id: 502,
      title: "Electric Scooter",
      price: 15000,
      image: chairImg, // Replace with appropriate image
      seller: { name: "Sumit Singh", avatar: SumitImg },
      location: "Bangalore, Karnataka",
      condition: "Excellent",
      description:
        "Electric scooter with 25km range per charge. Battery holds charge well, reaches speeds up to 25km/h. Foldable design for easy storage in dorm rooms or classrooms.",
      postedDate: "1 month ago",
      category: "transport",
    },
    {
      id: 503,
      title: "Bicycle Helmet and Safety Gear",
      price: 800,
      image: chairImg, // Replace with appropriate image
      seller: { name: "Paridhi Gupta", avatar: ParidhiImg },
      location: "Mumbai, Maharashtra",
      condition: "Like New",
      description:
        "Safety gear set including helmet, knee pads, and elbow pads. Used only a few times. Adjustable straps for perfect fit. Essential for safe campus commuting.",
      postedDate: "1 week ago",
      category: "transport",
    },
  ],
  other: [
    {
      id: 601,
      title: "Acoustic Guitar",
      price: 5000,
      image: chairImg, // Replace with appropriate image
      seller: { name: "Sumit Singh", avatar: SumitImg },
      location: "Delhi",
      condition: "Good",
      description:
        "Yamaha F310 acoustic guitar. Great sound quality, perfect for beginners and intermediate players. Comes with case, extra strings, and beginner's book.",
      postedDate: "3 weeks ago",
      category: "other",
    },
    {
      id: 602,
      title: "Badminton Racket Set",
      price: 1200,
      image: chairImg, // Replace with appropriate image
      seller: { name: "Paridhi Gupta", avatar: ParidhiImg },
      location: "Pune, Maharashtra",
      condition: "Excellent",
      description:
        "Set of 2 Yonex badminton rackets with 10 shuttlecocks and carrying case. Barely used, strings in perfect condition. Great for recreational play on campus.",
      postedDate: "2 weeks ago",
      category: "other",
    },
    {
      id: 603,
      title: "Yoga Mat and Fitness Equipment",
      price: 600,
      image: chairImg, // Replace with appropriate image
      seller: { name: "Shivansh Kumar", avatar: ShivanshImg },
      location: "Mumbai, Maharashtra",
      condition: "Like New",
      description:
        "6mm thick yoga mat with resistance bands and 2kg dumbbells. Perfect for dorm room workouts. Non-slip surface, easy to clean. Used for only one month.",
      postedDate: "1 week ago",
      category: "other",
    },
  ],
}

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

const Browse = () => {
  const [viewMode, setViewMode] = useState("grid")
  const [favorites, setFavorites] = useState(new Set())
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedState, setSelectedState] = useState("")
  const [selectedCity, setSelectedCity] = useState("")
  const [sortOption, setSortOption] = useState("newest")
  const [searchParams] = useSearchParams()
  const [displayProducts, setDisplayProducts] = useState([])
  const [categoryTitle, setCategoryTitle] = useState("All Products")

  // Get category from URL parameters
  const { category } = useParams()
  const categoryParam = category || searchParams.get("category") || "all"

  // Load products based on category
  useEffect(() => {
    let products = []

    if (categoryParam === "all") {
      // Combine all products from all categories
      Object.values(categoryProducts).forEach((categoryItems) => {
        products = [...products, ...categoryItems]
      })
      setCategoryTitle("All Products")
    } else if (categoryProducts[categoryParam]) {
      // Get products for the specific category
      products = categoryProducts[categoryParam]

      // Set a formatted title for the category
      const formattedCategory = categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
      setCategoryTitle(formattedCategory)
    }

    // Apply sorting
    sortProducts(products, sortOption)
  }, [categoryParam, sortOption])

  // Sort products based on selected option
  const sortProducts = (products, option) => {
    const sortedProducts = [...products]

    switch (option) {
      case "price-low":
        sortedProducts.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sortedProducts.sort((a, b) => b.price - a.price)
        break
      case "newest":
      default:
        // Assuming newer items have more recent postedDate
        sortedProducts.sort((a, b) => {
          // This is a simple sort - in a real app, you'd parse actual dates
          return a.postedDate < b.postedDate ? 1 : -1
        })
    }

    setDisplayProducts(sortedProducts)
  }

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      newFavorites.has(productId) ? newFavorites.delete(productId) : newFavorites.add(productId)
      return newFavorites
    })
  }

  const handleImageClick = (product) => setSelectedProduct(product)
  const closeOptions = () => setSelectedProduct(null)

  return (
    <div className="browse-page">
      <aside className="filters">
        <h3>Filters</h3>
        <div className="filter-section">
          <h4>Location</h4>
          <select onChange={(e) => setSelectedState(e.target.value)}>
            <option value="">Select State</option>
            {Object.keys(statesAndCities).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          {selectedState && (
            <select onChange={(e) => setSelectedCity(e.target.value)}>
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
            <input type="number" placeholder="Min" min="0" />
            <span>to</span>
            <input type="number" placeholder="Max" min="0" />
          </div>
        </div>

        <div className="filter-section">
          <h4>Condition</h4>
          <div className="checkbox-group">
            <label>
              <input type="checkbox" /> New
            </label>
            <label>
              <input type="checkbox" /> Like New
            </label>
            <label>
              <input type="checkbox" /> Good
            </label>
            <label>
              <input type="checkbox" /> Fair
            </label>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <h2 className="category-title">{categoryTitle}</h2>

        <div className="sort-options">
          <select onChange={(e) => setSortOption(e.target.value)} value={sortOption}>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <div className="view-toggles">
            <button onClick={() => setViewMode("grid")} className={viewMode === "grid" ? "active" : ""}>
              <Grid size={20} />
            </button>
            <button onClick={() => setViewMode("list")} className={viewMode === "list" ? "active" : ""}>
              <List size={20} />
            </button>
          </div>
        </div>

        <div className={`products-container ${viewMode}`}>
          {displayProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image" onClick={() => handleImageClick(product)}>
                <img src={product.image || "/placeholder.svg"} alt={product.title} />
                <div className="product-condition">{product.condition}</div>
                <button
                  className={`favorite-btn ${favorites.has(product.id) ? "active" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(product.id)
                  }}
                >
                  <Heart fill={favorites.has(product.id) ? "currentColor" : "none"} />
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
                  <span className="product-date">{product.postedDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayProducts.length === 0 && (
          <div className="no-products">
            <p>No products found for this category. Try adjusting your filters.</p>
          </div>
        )}
      </main>

      {selectedProduct && (
        <div className="product-options-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={closeOptions}>
              <X size={24} />
            </button>
            <div className="modal-product-image">
              <img src={selectedProduct.image || "/placeholder.svg"} alt={selectedProduct.title} />
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

              <div className="modal-seller-info">
                <h3>Seller Information</h3>
                <div className="seller-profile">
                  <img
                    src={selectedProduct.seller.avatar || "/placeholder.svg"}
                    alt={selectedProduct.seller.name}
                    className="seller-avatar"
                  />
                  <div>
                    <p className="seller-name">{selectedProduct.seller.name}</p>
                    <p className="listing-date">Posted: {selectedProduct.postedDate}</p>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button className="contact-seller">Contact Seller</button>
                <button
                  className={`add-to-favorites ${favorites.has(selectedProduct.id) ? "active" : ""}`}
                  onClick={() => toggleFavorite(selectedProduct.id)}
                >
                  {favorites.has(selectedProduct.id) ? "Remove from Favorites" : "Add to Favorites"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Browse

