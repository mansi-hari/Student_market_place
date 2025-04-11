import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaMapMarkerAlt,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaArrowLeft,
  FaShoppingCart,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false); // Changed to showContactInfo

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/products/${productId}`);
        setProduct(response.data);
        checkWishlistStatus(response.data._id);
        fetchSimilarProducts(response.data.category);
        const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(savedCart);
        setLoading(false);
      } catch (error) {
        setError("Failed to load product details");
        setLoading(false);
        toast.error("Failed to load product details");
      }
    };
    fetchProduct();
  }, [productId]);

  const checkWishlistStatus = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/wishlist/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInWishlist(response.data.isInWishlist);
    } catch (error) {}
  };

  const fetchSimilarProducts = async (category) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products?category=${category}&limit=4`);
      setSimilarProducts(response.data.filter((p) => p._id !== productId).slice(0, 3));
    } catch (error) {}
  };

  const toggleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add items to wishlist");
      navigate("/auth/login");
      return;
    }
    try {
      if (inWishlist) {
        await axios.delete(`http://localhost:5000/api/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await axios.post(`http://localhost:5000/api/wishlist/${productId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add items to your cart");
      navigate("/auth/login");
      return;
    }
    const isInCart = cart.some((item) => item._id === product._id);
    if (!isInCart) {
      const updatedCart = [...cart, product];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      toast.success(`${product.title} added to cart`);
    } else {
      toast.info(`${product.title} is already in your cart`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out this ${product.title} on Student Marketplace`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const contactSeller = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to contact the seller");
      navigate("/auth/login");
      return;
    }
    if (!product?.seller || !product.seller._id || product.seller.name === "Anonymous") {
      toast.error("Seller contact information not available");
      return;
    }
    console.log("Contact Seller Data:", product.seller);
    setShowContactInfo(!showContactInfo); // Toggle contact info visibility
  };

  if (loading) return (
    <div className="container mt-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-2">Loading product details...</p>
    </div>
  );

  if (error) return (
    <div className="container mt-5">
      <div className="alert alert-danger" role="alert">{error}</div>
      <Link to="/products" className="btn btn-primary">
        <FaArrowLeft className="me-2" /> Back to Products
      </Link>
    </div>
  );

  if (!product) return (
    <div className="container mt-5">
      <div className="alert alert-warning" role="alert">Product not found</div>
      <Link to="/products" className="btn btn-primary">
        <FaArrowLeft className="me-2" /> Back to Products
      </Link>
    </div>
  );

  return (
    <div className="container mt-4 mb-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{product.title}</li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="product-images-container">
            <div className="main-image-container">
              {product.photos?.length > 0 ? (
                <img
                  src={`http://localhost:5000/uploads/${product.photos[activeImage]}`}
                  alt={product.title}
                  className="main-product-image"
                  onError={(e) => e.target.src = "https://via.placeholder.com/400?text=No+Image"}
                />
              ) : (
                <div className="no-image-placeholder"><span>No Image Available</span></div>
              )}
            </div>
            {product.photos?.length > 1 && (
              <div className="thumbnail-container">
                {product.photos.map((photo, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${activeImage === index ? "active" : ""}`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={`http://localhost:5000/uploads/${photo}`}
                      alt={`${product.title} - ${index + 1}`}
                      onError={(e) => e.target.src = "https://via.placeholder.com/100?text=No+Image"}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <h1 className="product-title">{product.title}</h1>
          <div className="product-price-container">
            <span className="product-price">₹{product.price}</span>
            {product.negotiable && <span className="negotiable-badge">Negotiable</span>}
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">Condition:</span>
              <span className="meta-value">{product.condition}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Category:</span>
              <span className="meta-value">{product.category}</span>
            </div>
            <div className="meta-item location-meta">
              <FaMapMarkerAlt className="location-icon" />
              <span className="meta-value">{product.location}</span>
              {product.pincode && <span className="pincode">({product.pincode})</span>}
            </div>
          </div>

          <div className="product-actions">
            <button
              className={`btn btn-primary btn-lg contact-btn ${showContactInfo ? "active" : ""}`}
              onClick={contactSeller}
              disabled={!product.seller || !product.seller._id || product.seller.name === "Anonymous"}
            >
              {showContactInfo ? "Hide Contact" : "Contact Seller"}
            </button>
            <button
              className={`btn btn-outline-danger btn-lg wishlist-btn ${inWishlist ? "active" : ""}`}
              onClick={toggleWishlist}
            >
              {inWishlist ? (
                <><FaHeart className="me-2" /> In Wishlist</>
              ) : (
                <><FaRegHeart className="me-2" /> Add to Wishlist</>
              )}
            </button>
            <button
              className={`btn btn-success btn-lg add-to-cart-btn ${cart.some((item) => item._id === product._id) ? "disabled" : ""}`}
              onClick={(e) => handleAddToCart(product, e)}
              disabled={cart.some((item) => item._id === product._id)}
            >
              <FaShoppingCart className="me-2" />
              {cart.some((item) => item._id === product._id) ? "In Cart" : "Add to Cart"}
            </button>
            <button className="btn btn-outline-secondary share-btn" onClick={handleShare}>
              <FaShare />
            </button>
          </div>

          <div className="product-description">
            <h4>Description</h4>
            <p>{product.description}</p>
          </div>

          {product.tags && (
            <div className="product-tags">
              <h4>Tags</h4>
              <div className="tags-container">
                {product.tags.split(",").map((tag, index) => (
                  <span key={index} className="product-tag">{tag.trim()}</span>
                ))}
              </div>
            </div>
          )}

          <div className="seller-info">
            <h4>Seller Information</h4>
            <div className="seller-card">
              <div className="seller-avatar">
                {product.seller?.profileImage ? (
                  <img
                    src={
                      product.seller.profileImage.startsWith("http")
                        ? product.seller.profileImage
                        : `http://localhost:5000/uploads/${product.seller.profileImage.split("/uploads/")[1] || product.seller.profileImage}`
                    }
                    alt={product.seller.name}
                    onClick={() => setShowModal(true)}
                    style={{ cursor: "pointer" }}
                    onError={(e) => e.target.src = "https://via.placeholder.com/50?text=No+Image"}
                  />
                ) : (
                  <div className="avatar-placeholder">{product.seller?.name?.charAt(0) || "S"}</div>
                )}
              </div>
              <div className="seller-details">
                <h5>{product.seller?.name || "Anonymous"}</h5>
                <p className="seller-location">
                  <FaMapMarkerAlt className="me-1" /> {product.location}
                </p>
                {showContactInfo && (
                  <div className="contact-details-expand">
                    {product.phoneNumber ? (
                      <p className="contact-item">
                        <FaPhone className="me-2" /> {product.phoneNumber}
                      </p>
                    ) : (
                      <p className="contact-item text-muted">Phone number not available</p>
                    )}
                    {product.email ? (
                      <p className="contact-item">
                        <FaEnvelope className="me-2" /> {product.email}
                      </p>
                    ) : (
                      <p className="contact-item text-muted">Email not available</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {similarProducts.length > 0 && (
        <div className="similar-products mt-5">
          <h3>Similar Products</h3>
          <div className="row row-cols-1 row-cols-md-3 g-4">
            {similarProducts.map((similarProduct) => (
              <div key={similarProduct._id} className="col">
                <div className="card h-100 product-card">
                  <div className="position-relative">
                    {similarProduct.photos?.length > 0 ? (
                      <img
                        src={`http://localhost:5000/uploads/${similarProduct.photos[0]}`}
                        className="card-img-top similar-product-image"
                        alt={similarProduct.title}
                        onError={(e) => e.target.src = "https://via.placeholder.com/200?text=No+Image"}
                      />
                    ) : (
                      <div className="card-img-top similar-product-image-placeholder">No Image</div>
                    )}
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{similarProduct.title}</h5>
                    <p className="card-text product-price">₹{similarProduct.price}</p>
                    <Link to={`/product/${similarProduct._id}`} className="btn btn-primary w-100 view-details-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && product.seller?.profileImage && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <img
            src={
              product.seller.profileImage.startsWith("http")
                ? product.seller.profileImage
                : `http://localhost:5000/uploads/${product.seller.profileImage.split("/uploads/")[1] || product.seller.profileImage}`
            }
            alt={product.seller.name}
            style={{
              maxWidth: "250px",
              maxHeight: "250px",
              objectFit: "cover",
              border: "2px solid #fff",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
              borderRadius: "50%",
              transition: "transform 0.2s",
            }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400?text=No+Image";
              setShowModal(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;