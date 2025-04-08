"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Book, Laptop, Sofa, PenTool, Bike, MoreHorizontal, Heart, MessageCircle } from "lucide-react";
import CategoryCard from "../Components/CategoryCard";
import HowItWorks from "../Components/HowItWorksCard";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [messages, setMessages] = useState([]); // New state for messages
  const [newMessage, setNewMessage] = useState(""); // New state for typing message

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
  ]);

  // Fetch products and messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all products
        const productsResponse = await axios.get("http://localhost:5000/api/products");
        console.log("Products fetched:", productsResponse.data);

        if (Array.isArray(productsResponse.data)) {
          setProducts(productsResponse.data);

          // Update category counts
          const updatedCategories = [...categories];
          const categoryCounts = {};
          productsResponse.data.forEach((product) => {
            const category = product.category;
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          });
          updatedCategories.forEach((category, index) => {
            const count = categoryCounts[category.name] || 0;
            updatedCategories[index] = {
              ...category,
              count: `${count} item${count !== 1 ? "s" : ""}`,
            };
          });
          setCategories(updatedCategories);
        }

        // Fetch featured products
        const featuredResponse = await axios.get("http://localhost:5000/api/products/featured");
        if (Array.isArray(featuredResponse.data)) {
          setFeaturedProducts(featuredResponse.data);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load products");
        setLoading(false);
        toast.error("Failed to load products");
      }
    };

    const fetchMessages = async (productId) => {
      const token = localStorage.getItem("token");
      if (token && selectedProduct) {
        try {
          const response = await axios.get(`http://localhost:5000/api/messages/${productId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) {
            setMessages(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
          toast.error("Failed to load messages");
        }
      }
    };

    fetchData();
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token && selectedProduct) {
      fetchMessages(selectedProduct._id);
      const interval = setInterval(() => fetchMessages(selectedProduct._id), 5000); // Poll every 5 seconds
      return () => clearInterval(interval); // Cleanup
    }
  }, [selectedProduct]);

  // Fetch wishlist
  const fetchWishlist = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const wishlistProductIds = response.data.data.products.map((product) => product._id);
        setWishlist(wishlistProductIds);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  // Handle wishlist
  const handleAddToWishlist = async (product, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!isLoggedIn || !token) {
      toast.error("Please login to add items to your wishlist");
      navigate("/auth/login");
      return;
    }
    const isInWishlist = wishlist.includes(product._id); // Check if in wishlist
    try {
      if (isInWishlist) {
        await axios.delete(`http://localhost:5000/api/wishlist/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(wishlist.filter((id) => id !== product._id));
        toast.success(`${product.title} removed from wishlist`);
      } else {
        await axios.post(
          `http://localhost:5000/api/wishlist/${product._id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setWishlist([...wishlist, product._id]);
        toast.success(`${product.title} added to wishlist`);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  // Check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  // Handle product click and chat
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowContactInfo(true); // Open chat by default
    setMessages([]); // Reset messages
  };

  const handleCloseProductModal = () => {
    setSelectedProduct(null);
    setShowContactInfo(false);
    setMessages([]);
    setNewMessage("");
  };

  const handleSendMessage = async () => {
    const token = localStorage.getItem("token");
    if (!isLoggedIn || !token || !selectedProduct) {
      toast.error("Please login to send a message");
      navigate("/auth/login");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/messages",
        {
          receiver: selectedProduct.seller._id,
          product: selectedProduct._id,
          content: newMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage(""); // Clear input
      toast.success("Message sent!");
      // Fetch updated messages
      const response = await axios.get(`http://localhost:5000/api/messages/${selectedProduct._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

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
    );
  };

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
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/200";
                        }}
                      />
                    ) : (
                      <div className="no-image-placeholder">No Image</div>
                    )}
                    <button
                      className={`wishlist-button ${isInWishlist(product._id) ? "active" : ""}`} // Fixed with isInWishlist
                      onClick={(e) => handleAddToWishlist(product, e)}
                      aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"} // Fixed
                    >
                      <Heart size={20} color="#ff4d4d" fill={isInWishlist(product._id) ? "#ff4d4d" : "none"} /> {/* Fixed */}
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

      {/* Product Details Modal with Chat */}
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
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400";
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

                <div className="chat-container">
                  <h3>Chat with {selectedProduct.seller?.name || "Anonymous Seller"}</h3>
                  <div className="message-list">
                    {messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`message ${msg.sender._id === (localStorage.getItem("userId") || "").toString() ? "sent" : "received"}`}
                      >
                        <p>{msg.content}</p>
                        <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="message-input">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                  </div>
                </div>
                <button
                  className={`wishlist-btn ${isInWishlist(selectedProduct._id) ? "active" : ""}`} // Fixed
                  onClick={(e) => handleAddToWishlist(selectedProduct, e)}
                >
                  {isInWishlist(selectedProduct._id) ? "Remove from Wishlist" : "Add to Wishlist"} {/* Fixed */}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      <HowItWorks />
    </div>
  );
};

export default HomePage;