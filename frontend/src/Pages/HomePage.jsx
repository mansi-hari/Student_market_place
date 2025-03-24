"use client"

import { useState, useEffect } from "react"

import { Link, useNavigate } from "react-router-dom"
import { Book, Laptop, Sofa, PenTool, Bike, MoreHorizontal, Heart } from "lucide-react"
import CategoryCard from "../Components/CategoryCard"
import HowItWorks from "../Components/HowItWorksCard"
import { toast } from "react-hot-toast"
import "./HomePage.css"

// Import local images
import chairImg from "../Components/Assets/DeskChair.png"
import laptopImg from "../Components/Assets/Laptop3.png"
import laptop1Img from "../Components/Assets/HpLaptop.png"
import textbookImg from "../Components/Assets/books.png"
import Almirah from "../Components/Assets/Almirah.png"
import ShivanshImg from "../Components/Assets/Shivansh.jpg"
import ParidhiImg from "../Components/Assets/Paridhi.jpg"
import SumitImg from "../Components/Assets/Sumit.jpg"
import SamikshaImg from "../Components/Assets/Samiksha.jpg"

// Data
const categories = [
  {
    icon: <Book size={32} />,
    name: "Books",
    count: "2.5k items",
    link: "/products/books",
    description: "Textbooks, novels, study guides and more",
    popularItems: [
      { name: "Engineering Mathematics", price: 450 },
      { name: "Data Structures Textbook", price: 350 },
      { name: "Computer Networks", price: 500 },
      { name: "Physics for Engineers", price: 400 },
    ],
  },
  {
    icon: <Laptop size={32} />,
    name: "Electronics",
    count: "1.8k items",
    link: "/products/electronics",
    description: "Laptops, phones, accessories and gadgets",
    popularItems: [
      { name: "HP Laptop", price: 25000 },
      { name: "Dell Charger", price: 1200 },
      { name: "Wireless Mouse", price: 800 },
      { name: "Bluetooth Earphones", price: 1500 },
    ],
  },
  {
    icon: <Sofa size={32} />,
    name: "Furniture",
    count: "950 items",
    link: "/products/furniture",
    description: "Chairs, tables, beds and storage solutions",
    popularItems: [
      { name: "Study Table", price: 3500 },
      { name: "Desk Chair", price: 2000 },
      { name: "Bookshelf", price: 1800 },
      { name: "Bedside Table", price: 1200 },
    ],
  },
  {
    icon: <PenTool size={32} />,
    name: "Supplies",
    count: "3.2k items",
    link: "/products/supplies",
    description: "Stationery, art supplies and study materials",
    popularItems: [
      { name: "Scientific Calculator", price: 1200 },
      { name: "Drawing Kit", price: 800 },
      { name: "Notebook Bundle", price: 350 },
      { name: "Pen Set", price: 250 },
    ],
  },
  {
    icon: <Bike size={32} />,
    name: "Transport",
    count: "420 items",
    link: "/products/transport",
    description: "Bicycles, scooters and campus transport",
    popularItems: [
      { name: "Mountain Bike", price: 8000 },
      { name: "Electric Scooter", price: 15000 },
      { name: "Bicycle Helmet", price: 800 },
      { name: "Bike Lock", price: 500 },
    ],
  },
  {
    icon: <MoreHorizontal size={32} />,
    name: "Other",
    count: "1.1k items",
    link: "/products/other",
    description: "Sports equipment, musical instruments and more",
    popularItems: [
      { name: "Acoustic Guitar", price: 5000 },
      { name: "Badminton Racket", price: 1200 },
      { name: "Yoga Mat", price: 600 },
      { name: "Chess Set", price: 800 },
    ],
  },
]

const featuredItems = [
  {
    id: 1,
    title: "Dell XPS 13 Laptop",
    price: 15000,
    image: laptopImg,
    description: "Like new, includes charger",
    seller: { name: "Shivansh Kumar", avatar: ShivanshImg },
    postedDate: "2 days ago",
  },
  {
    id: 2,
    image: chairImg,
    title: "Ergonomic Desk Chair",
    price: 5000,
    description: "Great condition, very comfortable",
    seller: { name: "Paridhi Gupta", avatar: ParidhiImg },
    postedDate: "2024-06-08",
  },
  {
    id: 3,
    image: Almirah,
    title: "Almirah with Mirror",
    price: 2000,
    description: "Great condition, very comfortable",
    seller: { name: "Samiksha Sharma", avatar: SamikshaImg },
    postedDate: "2023-03-07",
  },
  {
    id: 4,
    image: textbookImg,
    title: "Textbook Bundle",
    price: 750,
    description: "5 Engineering textbooks",
    seller: { name: "Sumit Singh", avatar: SumitImg },
    postedDate: "2023-05-10",
  },
  {
    id: 5,
    title: "Hp Victus Laptop",
    price: 20000,
    image: laptop1Img,
    description: "Like new, includes charger",
    seller: { name: "Shivansh Kumar", avatar: ShivanshImg },
    postedDate: "2 days ago",
  },
]

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

const Home = () => {
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist))
    }

    // Check if user is logged in
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  const handleImageClick = (image, e) => {
    e.stopPropagation() // Prevent the product click event
    setSelectedImage(image)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  const handleAddToWishlist = (product, e) => {
    e.stopPropagation() // Prevent the product click event

    // Check if user is logged in
    if (!isLoggedIn) {
      toast.error("Please login to add items to your wishlist")
      navigate("/auth/login")
      return
    }

    // Check if product is already in wishlist
    const isInWishlist = wishlist.some((item) => item.id === product.id)

    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter((item) => item.id !== product.id)
      setWishlist(updatedWishlist)
      toast.success(`${product.title} removed from wishlist`)
    } else {
      // Add to wishlist
      setWishlist([...wishlist, product])
      toast.success(`${product.title} added to wishlist`)
    }
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
  }

  const handleCloseProductModal = () => {
    setSelectedProduct(null)
  }

  const handleContactSeller = (product) => {
    if (!isLoggedIn) {
      toast.error("Please login to contact the seller")
      navigate("/auth/login")
      return
    }

    // In a real app, this would open a chat or contact form
    toast.success(`Contacting ${product.seller.name} about ${product.title}`)
    // You could navigate to a chat page or open a modal here
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

  // Check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId)
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
                to={`/browse/${category.name.toLowerCase()}`}
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
            <Link to="/Browse" style={{ color: "#1d4ed8", textDecoration: "none" }}>
              View all
            </Link>
          </div>
          <div className="featured-grid">
            {featuredItems.map((product) => (
              <div key={product.id} className="featured-card" onClick={() => handleProductClick(product)}>
                <div className="featured-image-container">
                  <img src={product.image || "/placeholder.svg"} alt={product.title} className="cropped-image" />
                  <button
                    className={`wishlist-button ${isInWishlist(product.id) ? "active" : ""}`}
                    onClick={(e) => handleAddToWishlist(product, e)}
                    aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart size={20} color="#ff4d4d" fill={isInWishlist(product.id) ? "#ff4d4d" : "none"} />
                  </button>
                </div>
                <div className="featured-content">
                  <h3 className="featured-title">{product.title}</h3>
                  <p className="featured-price">₹{product.price}</p>
                  <p className="featured-description">{product.description}</p>
                  <div className="featured-seller">
                    <img
                      src={product.seller.avatar || "/placeholder.svg"}
                      alt={product.seller.name}
                      className="seller-avatar"
                      onClick={(e) => handleImageClick(product.seller.avatar, e)}
                    />
                    <span className="seller-name">{product.seller.name}</span>
                    <span className="posted-date">{product.postedDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content image-modal">
            <button className="close-modal" onClick={handleCloseModal}>
              ×
            </button>
            <img src={selectedImage || "/placeholder.svg"} alt="Full size" />
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="modal" onClick={handleCloseProductModal}>
          <div className="modal-content product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={handleCloseProductModal}>
              ×
            </button>
            <div className="product-modal-content">
              <img
                src={selectedProduct.image || "/placeholder.svg"}
                alt={selectedProduct.title}
                className="product-modal-image"
              />
              <div className="product-modal-details">
                <h2 className="product-modal-title">{selectedProduct.title}</h2>
                <p className="product-modal-price">₹{selectedProduct.price}</p>
                <p className="product-modal-description">{selectedProduct.description}</p>
                <div className="product-modal-seller">
                  <img
                    src={selectedProduct.seller.avatar || "/placeholder.svg"}
                    alt={selectedProduct.seller.name}
                    className="seller-avatar-large"
                    onClick={(e) => handleImageClick(selectedProduct.seller.avatar, e)}
                  />
                  <div className="seller-info">
                    <span className="seller-name-large">{selectedProduct.seller.name}</span>
                    <span className="posted-date-large">Posted: {selectedProduct.postedDate}</span>
                  </div>
                </div>
                <div className="product-modal-actions">
                  <button className="contact-seller-btn" onClick={() => handleContactSeller(selectedProduct)}>
                    Contact Seller
                  </button>
                  <button
                    className={`wishlist-btn ${isInWishlist(selectedProduct.id) ? "active" : ""}`}
                    onClick={(e) => handleAddToWishlist(selectedProduct, e)}
                  >
                    {isInWishlist(selectedProduct.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  </button>
                </div>
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

          <div style={{ maxWidth: "800px", margin: "40px auto", textAlign: "center" }}>
            <h2 style={{ color: "#2d3748", fontWeight: "700", marginBottom: "16px" }}>What is Student MarketPlace?</h2>
            <p style={{ color: "#4a5568", lineHeight: "1.6" }}>
              Student MarketPlace is a marketplace and classifieds platform that brings millions of students and sellers
              across universities together. Campus communities nationwide are actively engaging in second-hand shopping.
              You can buy & sell textbooks, electronics, furniture, study materials, and various other categories
              ranging from dorm essentials to academic resources, making it the perfect platform for student commerce.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

