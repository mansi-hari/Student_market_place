import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./Navbar.css";
import logo from "../Assets/logo.png";
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
  FaMapMarkerAlt,
} from "react-icons/fa";
import { colleges } from "../../utils/colleges"; // Importing colleges from utils

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setMenu("Home");
    else if (path.includes("/products")) setMenu("Browse");
    else if (path.includes("/sell")) setMenu("Sell");
    else if (path.includes("/wishlist")) setMenu("Wishlist");
    else setMenu("");

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [location.pathname]);

  const handleLocationChange = (event) => {
    const value = event.target.value;
    setLocationInput(value);

    if (value.trim()) {
      const filteredSuggestions = colleges.filter((college) =>
        college.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setLocationInput(suggestion);
    setSuggestions([]);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      const searchParams = new URLSearchParams();
      searchParams.set("search", search);
      if (locationInput && locationInput !== "Select University") {
        searchParams.set("college", locationInput);
      }
      navigate(`/products?${searchParams.toString()}`);
      setSearch("");
      setLocationInput(""); // Clear location input after search
    } else {
      toast.error("Please enter a search term");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="navbar-container">
      <div className="navbar-top">
        <div className="nav-logo">
          <Link to="/">
            <img src={logo || "/placeholder.svg"} alt="Logo" />
          </Link>
          <div className="logo-text">
            <p>Student Marketplace</p>
            <p className="location-text">MOHAN NAGAR</p>
          </div>
        </div>

        <div className="location-search-container">
          <div className="location-placeholder">
            <FaMapMarkerAlt className="location-icon" />
            <input
              type="text"
              placeholder="Select your college"
              value={locationInput}
              onChange={handleLocationChange}
              className="location-input"
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index} // Using index as key since colleges array doesn't have unique IDs
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="suggestion-item"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="search-bar-container">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search in Mohan Nagar colleges"
                value={search}
                onChange={handleSearchChange}
              />
            </div>
          </form>
        </div>

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

      {isSidebarOpen && (
        <div className="sidebar">
          <div className="sidebar-header">
            <img src={logo || "/placeholder.svg"} alt="Logo" className="sidebar-logo" />
            <p>Student Marketplace - Mohan Nagar</p>
            <FaTimes className="close-icon" onClick={() => setIsSidebarOpen(false)} />
          </div>
          <div className="sidebar-content">
            <div className="sidebar-section">
              {isLoggedIn ? (
                <>
                <Link to="/dashboard" className="sidebar-item">
                       <FaUser className="sidebar-icon" />
                       <span>Dashboard</span>
                   </Link>
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
    </div>
  );
};

export default Navbar;