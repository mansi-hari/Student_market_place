import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Book, Laptop, Sofa, PenTool, Bike, MoreHorizontal, Heart } from "lucide-react";
import CategoryCard from "../Components/CategoryCard";
import HowItWorks from "../Components/HowItWorksCard";
import "./HomePage.css";

const url = process.env.REACT_APP_API_URL;
const HomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false); 
  const [selectedSellerImage, setSelectedSellerImage] = useState(null); 

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

  // Fetch products
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all products
        const productsResponse = await axios.get(`${url}/api/products`);
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
        const featuredResponse = await axios.get(`${url}/api/products/featured`);
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

    fetchData();
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch wishlist
  const fetchWishlist = async (token) => {
    try {
      const response = await axios.get(`${url}/api/wishlist`, {
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
        await axios.delete(`${url}/api/wishlist/${product._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(wishlist.filter((id) => id !== product._id));
        toast.success(`${product.title} removed from wishlist`);
      } else {
        await axios.post(
          `${url}/api/wishlist/${product._id}`,
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

  // Navigate to product detail page on click
  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`); 
  };

  // Handle seller image click to open modal
  const handleSellerImageClick = (image) => {
    setSelectedSellerImage(image);
    setShowModal(true);
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
            <Link to="/products" style={{ color: "#1d4ed8", textDecoration: "none" }}>
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
                        src={`${url}/uploads/${product.photos[0]}`}
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
                      {product.seller?.profileImage && (
                        <img
                          src={
                            product.seller.profileImage.startsWith("http")
                              ? product.seller.profileImage
                              : `${url}/uploads/${product.seller.profileImage.split("/uploads/")[1] || product.seller.profileImage}`
                          }
                          alt={product.seller.name}
                          className="seller-avatar"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSellerImageClick(
                              product.seller.profileImage.startsWith("http")
                                ? product.seller.profileImage
                                : `${url}/uploads/${product.seller.profileImage.split("/uploads/")[1] || product.seller.profileImage}`
                            );
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/50?text=No+Image";
                          }}
                        />
                      )}
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

      {/* Seller Image Modal */}
      {showModal && selectedSellerImage && (
        <div
          className="modal"
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <img
            src={selectedSellerImage}
            alt="Seller Profile"
            style={{
              maxWidth: "300px",
              maxHeight: "300px",
              objectFit: "cover",
              border: "2px solid #fff",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
              borderRadius: "50%",
              transition: "transform 0.2s",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300?text=No+Image";
              console.log("Modal image error:", e.target.src, e.message);
              setShowModal(false);
            }}
          />
        </div>
      )}

      {/* How It Works */}
      <HowItWorks />
    </div>
  );
};

export default HomePage;