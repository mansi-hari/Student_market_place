import React, { useState } from "react";
import axios from "axios";
import { Heart, Grid, List, MapPin, ChevronDown, X } from "lucide-react";
import "./Browse.css";

import chairImg from "../Components/Assets/DeskChair.png";
import laptopImg from "../Components/Assets/Laptop3.png";
import textbookImg from "../Components/Assets/books.png";
import ShivanshImg from "../Components/Assets/Shivansh.jpg";

const statesAndCities = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
  "Karnataka": ["Bangalore", "Mysore"],
  "Delhi": ["New Delhi"],
  "Uttar Pradesh": ["Lucknow", "Kanpur"],
  "Tamil Nadu": ["Chennai", "Coimbatore"],
  "West Bengal": ["Kolkata", "Durgapur"],
  "Gujarat": ["Ahmedabad", "Surat"],
  "Rajasthan": ["Jaipur", "Udaipur"],
};

const Browse = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState(new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const products = [
    {
      id: 1,
      title: "Dell XPS 13 Laptop",
      price: 15000,
      image: laptopImg,
      seller: { name: "Shivansh Kumar", avatar: ShivanshImg },
      location: "Pune, Maharashtra",
    },
    {
      id: 2,
      title: "Ergonomic Desk Chair",
      price: 5000,
      image: chairImg,
      seller: { name: "Shivansh Kumar", avatar: ShivanshImg },
      location: "Mumbai, Maharashtra",
    },
    {
      id: 3,
      title: "Textbook Bundle",
      price: 750,
      image: textbookImg,
      seller: { name: "Shivansh Kumar", avatar: ShivanshImg },
      location: "Bangalore, Karnataka",
    },
  ];

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.has(productId) ? newFavorites.delete(productId) : newFavorites.add(productId);
      return newFavorites;
    });
  };

  const handleImageClick = (product) => setSelectedProduct(product);
  const closeOptions = () => setSelectedProduct(null);

  return (
    <div className="browse-page">
      <aside className="filters">
        <h3>Filters</h3>
        <select onChange={(e) => setSelectedState(e.target.value)}>
          <option value="">Select State</option>
          {Object.keys(statesAndCities).map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Enter City"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        />
      </aside>
      
      <main className="main-content">
        <div className="sort-options">
          <select onChange={(e) => setSortOption(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
          <button onClick={() => setViewMode("grid")}><Grid /></button>
          <button onClick={() => setViewMode("list")}><List /></button>
        </div>

        <div className={`products-container ${viewMode}`}>
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image" onClick={() => handleImageClick(product)}>
                <img src={product.image} alt={product.title} />
                <button
                  className={`favorite-btn ${favorites.has(product.id) ? "active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                >
                  <Heart fill={favorites.has(product.id) ? "currentColor" : "none"} />
                </button>
              </div>
              <div className="product-info">
                <h3>{product.title}</h3>
                <p>₹{product.price}</p>
                <p><MapPin size={16} /> {product.location}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedProduct && (
        <div className="product-options-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={closeOptions}><X size={24} /></button>
            <h2>{selectedProduct.title}</h2>
            <p>Price: ₹{selectedProduct.price}</p>
            <p>Seller: {selectedProduct.seller.name}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;
