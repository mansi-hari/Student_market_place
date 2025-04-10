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
import { colleges } from "../../utils/colleges";
import { useAuth } from "../../Context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, loading } = useAuth();
  const [menu, setMenu] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setMenu("Home");
    else if (path.includes("/products")) setMenu("Browse");
    else if (path.includes("/sell")) setMenu("Sell");
    else if (path.includes("/wishlist")) setMenu("Wishlist");
    else if (path.includes("/admin")) setMenu("Admin");
    else setMenu("");
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
      setLocationInput("");
      setIsSidebarOpen(false);
    } else {
      toast.error("Please enter a search term");
    }
  };

  const handleLogout = async () => {
    await logout(); 
    navigate("/"); // Navigate after logout
    setIsSidebarOpen(false);
  };

  const handleSidebarItemClick = () => {
    setIsSidebarOpen(false);
  };

  const handleLogoutAndClose = () => {
    handleLogout();
    handleSidebarItemClick();
  };

  if (loading) {
    return <div className="navbar-container">Loading...</div>;
  }

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
                    key={index}
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
          <li
            onClick={() => { setMenu("Home"); handleSidebarItemClick(); }}
            className={menu === "Home" ? "active" : ""}
          >
            <Link to="/">Home</Link>
            {menu === "Home" && <hr />}
          </li>
          <li
            onClick={() => { setMenu("Browse"); handleSidebarItemClick(); }}
            className={menu === "Browse" ? "active" : ""}
          >
            <Link to="/products">Browse Products</Link>
            {menu === "Browse" && <hr />}
          </li>
          <li
            onClick={() => { setMenu("Sell"); handleSidebarItemClick(); }}
            className={menu === "Sell" ? "active" : ""}
          >
            <Link to="/sell">Sell</Link>
            {menu === "Sell" && <hr />}
          </li>
          <li
            onClick={() => { setMenu("Wishlist"); handleSidebarItemClick(); }}
            className={menu === "Wishlist" ? "active" : ""}
          >
            <Link to="/wishlist">Wishlist</Link>
            {menu === "Wishlist" && <hr />}
          </li>
          <div className="auth-container">
            {currentUser ? (
              <>
                <Link to="/profile" className="auth-box" onClick={handleSidebarItemClick}>
                  <FaUser className="auth-icon" /> {currentUser.name || "Profile"}
                </Link>
                <button onClick={handleLogoutAndClose} className="auth-box logout-btn">
                  <FaSignOutAlt className="auth-icon" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="auth-box" onClick={handleSidebarItemClick}>
                  <FaUser className="auth-icon" /> Login
                </Link>
                <Link to="/auth/signup" className="auth-box" onClick={handleSidebarItemClick}>
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
            <p>Student Marketplace - Mohan Nagar, Ghaziabad</p>
            <FaTimes className="close-icon" onClick={() => setIsSidebarOpen(false)} />
          </div>
          <div className="sidebar-content">
            <div className="sidebar-section">
              {currentUser ? (
                <>
                  {currentUser.role === "admin" ? (
                    <Link to="/admin" className="sidebar-item" onClick={handleSidebarItemClick}>
                      <FaUser className="sidebar-icon" />
                      <span>Admin Panel</span>
                    </Link>
                  ) : (
                    <Link to="/dashboard" className="sidebar-item" onClick={handleSidebarItemClick}>
                      <FaUser className="sidebar-icon" />
                      <span>Dashboard</span>
                    </Link>
                  )}
                  <Link to="/profile" className="sidebar-item" onClick={handleSidebarItemClick}>
                    <FaUser className="sidebar-icon" />
                    <span>My Profile</span>
                  </Link>
                  <Link to="/cart" className="sidebar-item" onClick={handleSidebarItemClick}>
                    <FaShoppingCart className="sidebar-icon" />
                    <span>My Cart</span>
                  </Link>
                  <Link to="/messages" className="sidebar-item" onClick={handleSidebarItemClick}>
                    <FaComments className="sidebar-icon" />
                    <span>My Chats</span>
                  </Link>
                  <button onClick={handleLogoutAndClose} className="sidebar-item logout-item">
                    <FaSignOutAlt className="sidebar-icon" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/auth/login" className="sidebar-item" onClick={handleSidebarItemClick}>
                  <FaUser className="sidebar-icon" />
                  <span>Login/Register</span>
                </Link>
              )}
            </div>
            <div className="sidebar-section">
              <h4>Categories</h4>
              <Link to="/products/services" className="sidebar-item" onClick={handleSidebarItemClick}>
                <FaStore className="sidebar-icon" />
                <span>Services</span>
              </Link>
              <Link to="/products/furniture" className="sidebar-item" onClick={handleSidebarItemClick}>
                <FaStore className="sidebar-icon" />
                <span>Furniture</span>
              </Link>
              <Link to="/products/bikes" className="sidebar-item" onClick={handleSidebarItemClick}>
                <FaStore className="sidebar-icon" />
                <span>Transport</span>
              </Link>
              <Link to="/products/electronics" className="sidebar-item" onClick={handleSidebarItemClick}>
                <FaStore className="sidebar-icon" />
                <span>Electronics</span>
              </Link>
              <Link to="/products/others" className="sidebar-item" onClick={handleSidebarItemClick}>
                <FaStore className="sidebar-icon" />
                <span>Others</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;