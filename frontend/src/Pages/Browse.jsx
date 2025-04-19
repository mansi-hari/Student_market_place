import { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { Heart, Grid, List, MapPin, ShoppingCart } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";
import { colleges } from "../utils/colleges";
import "./Browse.css";

const Browse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useParams();
  const { currentUser, token } = useAuth(); 
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]); 
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
  const [selectedCategory, setSelectedCategory] = useState(category || "All Categories");
  const [selectedLocation, setSelectedLocation] = useState("Select University");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);

  const categories = [
    "All Categories",
    "Electronics",
    "Furniture",
    "Books",
    "Transport",
    "Supplies",
    "Others",
  ];

  useEffect(() => {
    const storedToken = localStorage.getItem("token"); 
    const authToken = token || storedToken; 
    setIsLoggedIn(!!authToken);

    // Fetch user-specific favorites from server
    const fetchFavorites = async () => {
      if (authToken && currentUser?._id) {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/wishlist`,
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          if (response.data.success) {
            setFavorites(response.data.data.products || []);
          } else {
            console.log("Wishlist fetch failed, server response:", response.data);
            setFavorites([]);
          }
        } catch (error) {
          console.error("Failed to fetch wishlist:", error.message);
          setFavorites([]);
          toast.error("Failed to load wishlist, check backend endpoint");
        }
      }
    };
    fetchFavorites();

    // Fetch cart from server
    const fetchCart = async () => {
      if (authToken && currentUser?._id) {
        try {
          const response = await axios.get(`http://localhost:5000/api/cart`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          if (response.data.success) {
            setCart(response.data.cart || []);
            console.log("Fetched cart for user:", currentUser._id, response.data.cart);
          } else {
            setCart([]);
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error.response ? error.response.data : error.message);
          setCart([]);
          toast.error("Failed to load cart");
        }
      } else {
        setCart([]);
      }
    };
    fetchCart();

    fetchProducts();
  }, [token, currentUser?._id, location.search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const urlParams = new URLSearchParams(location.search);
      const search = urlParams.get("search") || "";
      const college = urlParams.get("college") || "";

      const queryParams = new URLSearchParams();
      if (search) queryParams.set("search", search);
      if (college) {
        queryParams.set("college", college);
        setSelectedLocation(college); // Auto-set selected location from URL
      }

      let url = category
        ? `http://localhost:5000/api/products/category/${category}`
        : `http://localhost:5000/api/products`;

      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await axios.get(url);
      console.log("Fetched products with locations:", response.data.map((p) => ({ _id: p._id, location: p.location })));

      if (Array.isArray(response.data)) {
        setAllProducts(response.data);
        setCategoryTitle(category || "All Products");
      } else {
        setError("Invalid data format received from server");
      }

      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load products");
      setLoading(false);
      toast.error("Failed to load products");
    }
  };

  const getCollegeFromLocation = (location) => {
    if (!location) return "";
    const lowerLocation = location.toLowerCase().trim();
    console.log("Checking location:", lowerLocation);
    for (let college of colleges) {
      if (college === "Select University") continue;
      const collegeName = college.toLowerCase().trim();
      console.log("Comparing with college:", collegeName);
      if (lowerLocation === collegeName) { 
        console.log("Exact match found:", college);
        return college;
      }
    }
    console.log("No match found for location:", lowerLocation);
    return "";
  };

  const applyFilters = () => {
    let filteredProducts = [...allProducts];

    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("search")?.toLowerCase() || "";
    if (searchTerm) {
      filteredProducts = filteredProducts.filter((product) =>
        [product.title?.toLowerCase(), product.description?.toLowerCase(), product.category?.toLowerCase()]
          .some((field) => field?.includes(searchTerm))
      );
    }

    if (selectedCategory && selectedCategory !== "All Categories") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
      console.log(`Filtered by category ${selectedCategory}:`, filteredProducts.length);
    }

    if (selectedLocation && selectedLocation !== "Select University") {
      filteredProducts = filteredProducts.filter((product) => {
        const productLocation = product.location || "";
        const collegeMatch = getCollegeFromLocation(productLocation);
        console.log(`Checking product ${product._id}: location=${productLocation}, selected=${selectedLocation}, collegeMatch=${collegeMatch}`);
        return collegeMatch === selectedLocation;
      });
      console.log(`Filtered by location ${selectedLocation}:`, filteredProducts.length);
    }

    if (priceRange.min) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= Number(priceRange.min)
      );
    }
    if (priceRange.max) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= Number(priceRange.max)
      );
    }

    const selectedConditionsList = Object.keys(selectedConditions).filter(
      (condition) => selectedConditions[condition]
    );
    if (selectedConditionsList.length > 0) {
      filteredProducts = filteredProducts.filter(
        (product) => product.condition && selectedConditionsList.includes(product.condition)
      );
    }

    if (sortOption === "price-low") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else {
      filteredProducts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    setDisplayProducts(filteredProducts);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    console.log("Category changed to:", value);
    setSelectedCategory(value);
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    console.log("Location changed to:", value);
    setSelectedLocation(value);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    console.log(`Price ${name} changed to:`, value);
    setPriceRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleConditionChange = (condition) => {
    console.log("Condition toggled:", condition);
    setSelectedConditions((prev) => ({
      ...prev,
      [condition]: !prev[condition],
    }));
  };

  useEffect(() => {
    if (allProducts.length > 0) {
      console.log("Triggering applyFilters");
      applyFilters();
    }
  }, [
    allProducts,
    selectedCategory,
    selectedLocation,
    priceRange,
    selectedConditions,
    sortOption,
    location.search,
  ]);

  const toggleFavorite = async (product, e) => {
    e.stopPropagation();
    if (!currentUser) {
      toast.error("Please login to add items to your wishlist");
      navigate("/auth/login");
      return;
    }
    const authToken = localStorage.getItem("token") || token; 
    const isInFavorites = favorites.some((item) => item._id === product._id);
    try {
      if (isInFavorites) {
        const response = await axios.delete(
          `http://localhost:5000/api/wishlist/${product._id}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (response.data.success) {
          const updatedFavorites = favorites.filter((item) => item._id !== product._id);
          setFavorites(updatedFavorites);
          toast.success(`${product.title} removed from wishlist`);
        }
      } else {
        const response = await axios.post(
          `http://localhost:5000/api/wishlist/${product._id}`,
          {},
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (response.data.success) {
          const updatedFavorites = [...favorites, product];
          setFavorites(updatedFavorites);
          toast.success(`${product.title} added to wishlist`);
        }
      }
      // Refetch favorites to ensure sync with server
      const fetchFavorites = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/wishlist`,
            { headers: { Authorization: `Bearer ${authToken}` } }
          );
          if (response.data.success) {
            setFavorites(response.data.data.products || []);
          } else {
            console.log("Refetch failed, server response:", response.data);
          }
        } catch (error) {
          console.error("Failed to refetch wishlist:", error.message);
        }
      };
      fetchFavorites();
    } catch (error) {
      console.error("Toggle favorite error:", error.message);
      toast.error("Failed to update wishlist");
    }
  };

  const handleAddToCart = async (product, e) => {
    e.stopPropagation();
    if (!currentUser) {
      toast.error("Please login to add items to your cart");
      navigate("/auth/login");
      return;
    }
    const authToken = localStorage.getItem("token") || token; 
    console.log("Token being sent:", authToken); 
    if (!authToken) {
      toast.error("No valid token, please login again");
      navigate("/auth/login");
      return;
    }
    const isInCart = cart.some((item) => item._id === product._id);
    if (!isInCart) {
      try {
        const response = await axios.post(
          `http://localhost:5000/api/cart/add/${product._id}`,
          {},
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        if (response.data.success) {
          setCart([...cart, product]); 
          console.log("Added to cart for user:", currentUser._id, product._id);
          toast.success(`${product.title} added to cart`);
        }
      } catch (error) {
        console.error("Failed to add to cart:", error.response ? error.response.data : error.message);
        toast.error("Failed to add to cart");
      }
    } else {
      toast.info(`${product.title} is already in your cart`);
    }
  };

  const handleIntent = async (product) => {
    if (!currentUser) {
      toast.error("Please login to register intent");
      navigate("/auth/login");
      return;
    }
    const authToken = localStorage.getItem("token") || token; 
    try {
      const response = await axios.post(
        `http://localhost:5000/api/products/${product._id}/intent`,
        {},
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      if (response.data.success) {
        toast.success("Intent registered successfully!");
      } else {
        toast.error(response.data.message || "Failed to register intent");
      }
    } catch (error) {
      toast.error("Failed to register intent");
    }
  };

  const isInFavorites = (productId) => favorites.some((item) => item._id === productId);
  const isInCart = (productId) => cart.some((item) => item._id === productId);

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
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">{error}</div>
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
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="form-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-section">
          <h4>Location</h4>
          <select
            value={selectedLocation}
            onChange={handleLocationChange}
            className="form-select"
          >
            {["Select University", ...colleges].map((college, index) => (
              <option key={index} value={college}>
                {college}
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
              name="min"
              value={priceRange.min}
              onChange={handlePriceChange}
              className="form-control"
              min="0"
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max"
              name="max"
              value={priceRange.max}
              onChange={handlePriceChange}
              className="form-control"
              min="0"
            />
          </div>
        </div>

        <div className="filter-section">
          <h4>Condition</h4>
          <div className="checkbox-group">
            {Object.keys(selectedConditions).map((condition) => (
              <div key={condition} className="form-check">
                <input
                  type="checkbox"
                  id={`condition-${condition}`}
                  checked={selectedConditions[condition]}
                  onChange={() => handleConditionChange(condition)}
                  className="form-check-input"
                />
                <label
                  htmlFor={`condition-${condition}`}
                  className="form-check-label"
                >
                  {condition}
                </label>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn btn-outline-secondary w-100 mt-3"
          onClick={() => {
            console.log("Resetting filters");
            setSelectedCategory("All Categories");
            setSelectedLocation("Select University");
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
          <select
            value={sortOption}
            onChange={(e) => {
              console.log("Sort changed to:", e.target.value);
              setSortOption(e.target.value);
            }}
            className="form-select"
          >
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
                <div
                  className="product-image"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  {product.photos?.length ? (
                    <img
                      src={`http://localhost:5000/uploads/${product.photos[0]}`}
                      alt={product.title}
                      onError={(e) => (e.target.src = "https://via.placeholder.com/200")}
                    />
                  ) : (
                    <div className="no-image-placeholder">No Image</div>
                  )}
                  <div className="product-condition">{product.condition}</div>
                  <button
                    className={`favorite-btn ${isInFavorites(product._id) ? "active" : ""}`}
                    onClick={(e) => toggleFavorite(product, e)}
                  >
                    <Heart
                      size={20}
                      fill={isInFavorites(product._id) ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth={1.5}
                    />
                  </button>
                </div>
                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p className="product-price">₹{product.price}</p>
                  <p className="product-location">
                    <MapPin size={16} /> {product.location || "N/A"}
                  </p>
                  {viewMode === "list" && (
                    <p className="product-description">{product.description}</p>
                  )}
                  <div className="product-actions">
                    <Link
                      to={`/product/${product._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Full Details
                    </Link>
                    <button
                      onClick={() => handleIntent(product)}
                      className="btn btn-sm intent-to-buy-btn"
                      disabled={
                        product.intentBy ||
                        product.seller.toString() === currentUser?._id
                      }
                    >
                      Intent to Buy
                    </button>
                    <button
                      className={`btn btn-sm btn-success add-to-cart-btn ${isInCart(product._id) ? "disabled" : ""}`}
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={isInCart(product._id)}
                    >
                      <ShoppingCart size={16} />{" "}
                      {isInCart(product._id) ? "In Cart" : "Add to Cart"}
                    </button>
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
    </div>
  );
};

export default Browse;