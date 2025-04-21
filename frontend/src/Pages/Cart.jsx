import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
const url = process.env.REACT_APP_API_URL;

const Cart = () => {
  const [cart, setCart] = useState([]);
  const { token, currentUser } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      if (!token || !currentUser) {
        console.log("No token or user found, cart fetch skipped. Token:", token, "User:", currentUser);
        return;
      }

      try {
        const response = await axios.get(`${url}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Cart data fetched from server:", response.data.cart);
        setCart(response.data.cart || []);
      } catch (error) {
        console.error("Failed to fetch cart:", error.response ? error.response.data : error.message);
      }
    };

    fetchCart();
  }, [token, currentUser]);

  const removeFromCart = async (productId) => {
    if (!token) {
      console.log("No token, cannot remove from cart");
      return;
    }

    try {
      await axios.delete(`${url}/api/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedCart = cart.filter((item) => item.product?._id !== productId); 
      setCart(updatedCart);
      console.log("Item removed from cart:", productId);
    } catch (error) {
      console.error("Failed to remove from cart:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p className="empty-cart">
          Your cart is empty. <Link to="/products">Continue shopping</Link>
        </p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.product?._id} className="cart-item-card">
              <div className="item-image">
                {item.product?.photos && item.product.photos.length > 0 ? (
                  <img
                    src={`${url}/uploads/${item.product.photos[0]}`}
                    alt={item.product?.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/100?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="no-image-placeholder">No Image</div>
                )}
              </div>
              <div className="item-details">
                <h3 className="item-title">{item.product?.title || "N/A"}</h3>
                <p className="item-price">Price: ₹{item.product?.price || 0}</p>
                <p className="item-condition">Condition: {item.product?.condition || "N/A"}</p>
                <p className="item-location">
                  {item.product?.location} {item.product?.pincode && `(${item.product.pincode})`}
                </p>
              </div>
              <div className="item-actions">
                <Link to={`/product/${item.product?._id}`} className="btn view-details-btn">
                  View Details
                </Link>
                <button className="btn remove-btn" onClick={() => removeFromCart(item.product?._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;