"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-hot-toast"
import "./Navbar.css"
import LocationSearch from "../LocationSearch"
import { getSelectedLocation } from "../../utils/locationService"

import logo from "../Assets/logo.png"
import waterPurifierImage from "../Assets/water-purifier.png"
import metalBedImage from "../Assets/metal-bed.png"
import laptopImage from "../Assets/HpLaptop.png"

import {
  FaSearch,
  FaStore,
  FaShoppingCart,
  FaBars,
  FaTimes,
  FaUser,
  FaUserPlus,
  FaAd,
  FaComments,
  FaMoneyCheckAlt,
  FaHeart,
  FaSignOutAlt,
} from "react-icons/fa"

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [menu, setMenu] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  // Sample product data for search results
  const products = [
    { id: 1, name: "Water Purifier", image: waterPurifierImage, price: "₹800/mo", originalPrice: "₹1479/mo" },
    { id: 2, name: "Napster Metal Queen Bed", image: metalBedImage, price: "₹1000/mo", originalPrice: "₹1500/mo" },
    { id: 3, name: "Hp Victus Laptop", image: laptopImage, price: "₹25000/mo", originalPrice: "₹30000/mo" },
  ]

  // Set active menu based on current path and check login status
  useEffect(() => {
    const path = location.pathname
    if (path === "/") setMenu("Home")
    else if (path.includes("/products")) setMenu("Browse")
    else if (path.includes("/sell")) setMenu("Sell")
    else if (path.includes("/wishlist")) setMenu("Wishlist")
    else setMenu("")

    // Check if user is logged in
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setIsLoggedIn(true)
      setUser(JSON.parse(userData))
    } else {
      setIsLoggedIn(false)
      setUser(null)
    }

    // Get selected location from localStorage
    const savedLocation = getSelectedLocation()
    if (savedLocation) {
      setSelectedLocation(savedLocation)
    }
  }, [location.pathname])

  // Fix the handleLocationSelect function to avoid confusion with the router location
  const handleLocationSelect = (selectedLoc) => {
    setSelectedLocation(selectedLoc)

    // Refresh products if we're on a product page
    if (location.pathname.includes("/products")) {
      // We'll add the location filter to the current URL
      const searchParams = new URLSearchParams(window.location.search)

      if (selectedLoc) {
        searchParams.set("location", selectedLoc.pinCode)
      } else {
        searchParams.delete("location")
      }

      navigate({
        pathname: location.pathname,
        search: searchParams.toString(),
      })
    }

    if (selectedLoc) {
      toast.success(`Location set to ${selectedLoc.name}`)
    }
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (search.trim()) {
      const searchParams = new URLSearchParams()
      searchParams.set("search", search)

      // Add location to search if selected
      if (selectedLocation) {
        searchParams.set("location", selectedLocation.pinCode)
      }

      navigate(`/products?${searchParams.toString()}`)
      setSearchOpen(false)
    }
  }

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`)
    setSearchOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setUser(null)
    toast.success("Logged out successfully")
    navigate("/")
  }

  // Filter products based on the search term
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="navbar-container">
      {/* Top Navigation Bar */}
      <div className="navbar-top">
        <div className="nav-logo">
          <Link to="/">
            <img src={logo || "/placeholder.svg"} alt="Logo" />
          </Link>
          <p>Student Marketplace</p>

          {/* Location search component */}
          <LocationSearch onLocationSelect={handleLocationSelect} initialLocation={selectedLocation} />
        </div>

        {/* Search Bar */}
        <div className="search-bar-container">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-bar" onClick={() => setSearchOpen(true)}>
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Search for products" value={search} onChange={handleSearchChange} />
            </div>
          </form>
          {searchOpen && (
            <div className="search-dropdown">
              <h4>Popular Searches</h4>
              <div className="search-tags">
                {["Bed", "Washing Machine", "Fridge", "Air Conditioner", "Mattress", "Cooler"].map((item) => (
                  <span
                    key={item}
                    className="search-tag"
                    onClick={() => {
                      setSearch(item)

                      const searchParams = new URLSearchParams()
                      searchParams.set("search", item)

                      // Add location to search if selected
                      if (selectedLocation) {
                        searchParams.set("location", selectedLocation.pinCode)
                      }

                      navigate(`/products?${searchParams.toString()}`)
                      setSearchOpen(false)
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <h4>Top Selling Products</h4>
              <div className="top-products">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-card" onClick={() => handleProductClick(product.id)}>
                    <img src={product.image || "/placeholder.svg"} alt={product.name} />
                    <p>{product.name}</p>
                    <span>
                      {product.price} <del>{product.originalPrice}</del>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="nav-top-options">
          <Link to="/wishlist" className="nav-item">
            <FaHeart className="nav-icon" />
            <span>Wishlist</span>
          </Link>
          <Link to="/cart" className="nav-item cart">
            <FaShoppingCart className="nav-icon" />
            <span>Cart</span>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="navbar-bottom">
        <ul className="nav-menu">
          <li className="menu-item" onClick={() => setIsSidebarOpen(true)}>
            <FaBars className="menu-icon" />
          </li>
          <li onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>
            <Link to="/">Home</Link>
            {menu === "Home" && <hr />}
          </li>
          <li onClick={() => setMenu("Browse")} className={menu === "Browse" ? "active" : ""}>
            <Link to="/products">Browse Products</Link>
            {menu === "Browse" && <hr />}
          </li>
          <li onClick={() => setMenu("Sell")} className={menu === "Sell" ? "active" : ""}>
            <Link to="/sell">Sell</Link>
            {menu === "Sell" && <hr />}
          </li>
          <li onClick={() => setMenu("Wishlist")} className={menu === "Wishlist" ? "active" : ""}>
            <Link to="/wishlist">Wishlist</Link>
            {menu === "Wishlist" && <hr />}
          </li>
          <div className="auth-container">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="auth-box">
                  <FaUser className="auth-icon" /> {user?.name || "Profile"}
                </Link>
                <button onClick={handleLogout} className="auth-box logout-btn">
                  <FaSignOutAlt className="auth-icon" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="auth-box">
                  <FaUser className="auth-icon" /> Login
                </Link>
                <Link to="/auth/signup" className="auth-box">
                  <FaUserPlus className="auth-icon" /> Signup
                </Link>
              </>
            )}
          </div>
        </ul>
      </div>

      {/* Sidebar Menu */}
      {isSidebarOpen && (
        <div className="sidebar">
          <div className="sidebar-header">
            <img src={logo || "/placeholder.svg"} alt="Logo" className="sidebar-logo" />
            <p>Student MarketPlace</p>
            <FaTimes className="close-icon" onClick={() => setIsSidebarOpen(false)} />
          </div>
          <div className="sidebar-content">
            <div className="sidebar-section">
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="sidebar-item">
                    <FaUser className="sidebar-icon" />
                    <span>My Profile</span>
                  </Link>
                  <button onClick={handleLogout} className="sidebar-item logout-item">
                    <FaSignOutAlt className="sidebar-icon" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/auth/login" className="sidebar-item">
                  <FaUser className="sidebar-icon" />
                  <span>Login/Register</span>
                </Link>
              )}
              <Link to="/my-ads" className="sidebar-item">
                <FaAd className="sidebar-icon" />
                <span>My Ads</span>
              </Link>
              <Link to="/messages" className="sidebar-item">
                <FaComments className="sidebar-icon" />
                <span>My Chats</span>
              </Link>
              <Link to="/orders" className="sidebar-item">
                <FaMoneyCheckAlt className="sidebar-icon" />
                <span>Orders and Payments</span>
              </Link>
            </div>
            <div className="sidebar-section">
              <h4>Categories</h4>
              <Link to="/products/services" className="sidebar-item">
                <FaStore className="sidebar-icon" />
                <span>Services</span>
              </Link>
              <Link to="/products/stationary" className="sidebar-item">
                <FaStore className="sidebar-icon" />
                <span>Stationary</span>
              </Link>
              <Link to="/products/bikes" className="sidebar-item">
                <FaStore className="sidebar-icon" />
                <span>Bikes</span>
              </Link>
              <Link to="/products/furniture" className="sidebar-item">
                <FaStore className="sidebar-icon" />
                <span>Furniture & Decor</span>
              </Link>
              <Link to="/products/appliances" className="sidebar-item">
                <FaStore className="sidebar-icon" />
                <span>Appliances, ACs</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for closing dropdowns */}
      {searchOpen && (
        <div
          className="overlay"
          onClick={() => {
            setSearchOpen(false)
          }}
        />
      )}
    </div>
  )
}

export default Navbar

