import React, { useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { Link } from "react-router-dom";
import { MapPin, Heart, ShoppingCart } from "lucide-react"; // Added Heart and ShoppingCart

const ProductCard = ({ product, isInFavorites, isInCart, toggleFavorite, handleAddToCart, handleImageClick }) => {
  const { registerIntent, currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [intentStatus, setIntentStatus] = useState(null);

  const handleIntent = async () => {
    try {
      console.log("Registering intent for product:", product._id, "Current User:", currentUser?._id);
      const response = await registerIntent(product._id);
      console.log("Intent response:", response);
      if (response.success) {
        setIntentStatus("Intent registered successfully!");
      } else {
        setIntentStatus(response.message || "Failed to register intent");
      }
    } catch (error) {
      console.error("Intent error:", error);
      setIntentStatus("Failed to register intent due to an error: " + error.message);
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-img-top position-relative" onClick={() => handleImageClick(product)}>
        {product.photos && product.photos.length > 0 ? (
          <img
            src={`http://localhost:5000/uploads/${product.photos[0]}`}
            alt={product.title}
            className="card-img-top"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/200";
            }}
          />
        ) : (
          <div className="no-image-placeholder text-center p-3">No Image</div>
        )}
        <span className="badge bg-danger position-absolute top-0 start-0 m-2">{product.condition}</span>
        <button
          className={`btn btn-outline-${isInFavorites ? "danger" : "primary"} position-absolute top-0 end-0 m-2`}
          onClick={(e) => toggleFavorite(e)}
        >
          <Heart fill={isInFavorites ? "red" : "none"} size={18} />
        </button>
      </div>
      <div className="card-body">
        <h5 className="card-title">{product.title}</h5>
        <p className="card-text text-danger fw-bold">₹{product.price}</p>
        <p className="card-text">
          <MapPin size={16} /> {product.location}
        </p>
        <p className="card-text text-muted">{new Date(product.createdAt).toLocaleDateString()}</p>
        <div className="d-flex gap-2">
          <Link to={`/product/${product._id}`} className="btn btn-primary btn-sm">
            Full Details
          </Link>
          <button
            onClick={handleIntent}
            className="btn btn-info btn-sm"
            disabled={product.intentBy || product.seller.toString() === currentUser?._id}
          >
            Intent to Buy
          </button>
          <button
            className={`btn btn-success btn-sm ${isInCart ? "disabled" : ""}`}
            onClick={(e) => handleAddToCart(e)}
            disabled={isInCart}
          >
            <ShoppingCart size={16} /> {isInCart ? "In Cart" : "Add to Cart"}
          </button>
          <button onClick={() => setShowModal(true)} className="btn btn-primary btn-sm">
            Contact Seller
          </button>
        </div>
        {intentStatus && <p className={`mt-2 ${intentStatus.includes("success") ? "text-success" : "text-danger"}`}>{intentStatus}</p>}
      </div>
      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Contact Seller</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Phone: {product.phoneNumber}</p>
                <p>Email: {product.email}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;