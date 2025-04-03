import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { Heart, Grid, List, MapPin, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./Browse.css";

const Browse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useParams();
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [displayProducts, setDisplayProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("All Products");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedConditions, setSelectedConditions] = useState({
    New: false,
    "Like New": false,
    Good: false,
    Used: false,
  });
  const [selectedCategory, setSelectedCategory] = useState(category || "");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);

  const categories = [
    "All Categories",
    "Services",
    "Stationary",
    "Bikes",
    "Furniture & Decor",
    "Appliances",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const savedFavorites = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setFavorites(savedFavorites);

    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:5000/api/products";

      const urlParams = new URLSearchParams(location.search);
      const search = urlParams.get("search") || "";
      const college = urlParams.get("college") || "";

      const queryParams = new URLSearchParams();
      if (search) queryParams.set("search", search);
      if (college) queryParams.set("college", college);

      if (category) {
        url = `http://localhost:5000/api/products/category/${category}`;
      }

      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      const response = await axios.get(url);
      if (Array.isArray(response.data)) {
        setAllProducts(response.data);
        setCategoryTitle(category ? category : "All Products");
      } else {
        setError("Invalid data format received from server");
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to load products");
      setLoading(false);
      toast.error("Failed to load products");
    }
  };

  const applyFilters = (products = allProducts) => {
    let filteredProducts = [...products];

    // Apply search filter from URL
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("search")?.toLowerCase() || "";
    const locationFilter = urlParams.get("college")?.toLowerCase() || "";

    if (searchTerm) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title?.toLowerCase().includes(searchTerm) ||
          product.description?.toLowerCase().includes(searchTerm) ||
          product.category?.toLowerCase().includes(searchTerm)
      );
    }

    if (locationFilter) {
      filteredProducts = filteredProducts.filter(
        (product) => product.location && product.location.toLowerCase().includes(locationFilter)
      );
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== "All Categories") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply price range filter
    if (priceRange.min !== "") {
      filteredProducts = filteredProducts.filter((product) => product.price >= Number(priceRange.min));
    }
    if (priceRange.max !== "") {
      filteredProducts = filteredProducts.filter((product) => product.price <= Number(priceRange.max));
    }

    // Apply condition filter
    const selectedConditionsList = Object.keys(selectedConditions).filter(
      (condition) => selectedConditions[condition]
    );
    if (selectedConditionsList.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedConditionsList.includes(product.condition)
      );
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setDisplayProducts(filteredProducts);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConditionChange = (condition) => {
    setSelectedConditions((prev) => ({
      ...prev,
      [condition]: !prev[condition],
    }));
  };

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [location.search, allProducts, selectedCategory, priceRange, selectedConditions, sortOption]);

  const toggleFavorite = async (product, e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!isLoggedIn || !token) {
      toast.error("Please login to add items to your wishlist");
      navigate("/auth/login");
      return;
    }

    const isInFavorites = favorites.some((item) => item._id === product._id);

    try {
      if (isInFavorites) {
        const response = await axios.delete(`http://localhost:5000/api/wishlist/${product._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const updatedFavorites = favorites.filter((item) => item._id !== product._id);
          setFavorites(updatedFavorites);
          localStorage.setItem("wishlist", JSON.stringify(updatedFavorites));
          toast.success(`${product.title} removed from wishlist`);
        }
      } else {
        const response = await axios.post(
          `http://localhost:5000/api/wishlist/${product._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          const updatedFavorites = [...favorites, product];
          setFavorites(updatedFavorites);
          localStorage.setItem("wishlist", JSON.stringify(updatedFavorites));
          toast.success(`${product.title} added to wishlist`);
        }
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleImageClick = (product) => {
    setSelectedProduct(product);
  };

  const closeOptions = () => {
    setSelectedProduct(null);
  };

  const handleContactSeller = () => {
    if (!isLoggedIn) {
      toast.error("Please login to contact the seller");
      navigate("/auth/login");
      return;
    }

    navigate(`/chat/${selectedProduct.seller._id}`);
  };

  const isInFavorites = (productId) => {
    return favorites.some((item) => item._id === productId);
  };

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = displayProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(displayProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="browse-page">
      <aside className="filters">
        <h3>Filters</h3>
        <div className="filter-section">
          <h4>Category</h4>
          <select
            onChange={(e) => setSelectedCategory(e.target.value)}
            value={selectedCategory}
            className="form-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat === "All Categories" ? "" : cat}>
                {cat}
              </option>
            ))}
          </select>
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
            setSelectedCategory("");
            setPriceRange({ min: "", max: "" });
            setSelectedConditions({
              New: false,
              "Like New": false,
              Good: false,
              Used: false,
            });
            navigate("/products");
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
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image" onClick={() => handleImageClick(product)}>
                  {product.photos && product.photos.length > 0 ? (
                    <img
                      src={`http://localhost:5000/uploads/${product.photos[0]}`}
                      alt={product.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/200";
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
              <p>No products found. Try adjusting your filters or search term.</p>
              <Link to="/sell" className="btn btn-primary mt-3">
                List an Item
              </Link>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-btn"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => paginate(page)}
                className={`page-btn ${currentPage === page ? "active" : ""}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              Next
            </button>
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
              {selectedProduct.photos && selectedProduct.photos.length > 0 ? (
                <img
                  src={`http://localhost:5000/uploads/${selectedProduct.photos[0]}`}
                  alt={selectedProduct.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/400";
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;