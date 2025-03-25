import React, { useState } from "react";
import ProductCard from "../Components/ProductCard/ProductCard"; 
import ChatComponent from "./ChatPage"; // Ensure correct import path

const ProductDetails = ({ product }) => {
  const [showChat, setShowChat] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);

  // Define openChat function and pass it to ProductCard
  const openChat = async (sellerId) => {
    try {
      const response = await fetch(`/api/users/${sellerId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch seller info");
      }
      const data = await response.json();
      setSellerInfo(data);
      setShowChat(true);
    } catch (error) {
      console.error("Error fetching seller info:", error);
    }
  };

  return (
    <div>
      <h2>{product.title}</h2>
      <p>{product.description}</p>

      {/* ✅ Pass openChat as a prop to ProductCard */}
      <ProductCard product={product} openChat={openChat} />

      {/* ✅ Ensure ChatComponent is shown only when showChat is true */}
      {showChat && sellerInfo && (
        <ChatComponent sellerInfo={sellerInfo} closeChat={() => setShowChat(false)} />
      )}
    </div>
  );
};

export default ProductDetails;
