import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
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
            <div key={item._id} className="cart-item-card">
              <div className="item-image">
                {item.photos && item.photos.length > 0 ? (
                  <img
                    src={`http://localhost:5000/uploads/${item.photos[0]}`}
                    alt={item.title}
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
                <h3 className="item-title">{item.title}</h3>
                <p className="item-price">Price: ₹{item.price}</p>
                <p className="item-condition">Condition: {item.condition}</p>
                <p className="item-location">
                  {item.location} {item.pincode && `(${item.pincode})`}
                </p>
              </div>
              <div className="item-actions">
                <Link to={`/product/${item._id}`} className="btn view-details-btn">
                  View Details
                </Link>
                <button className="btn remove-btn" onClick={() => removeFromCart(item._id)}>
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