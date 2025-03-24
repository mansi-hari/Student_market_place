import React from "react";

const ProductCard = ({ product, openChat }) => {
  if (!product) return null; // Ensure product is not undefined

  return (
    <div className="product-card">
      <h3>{product.title}</h3>
      {/* ✅ Use openChat correctly */}
      <button onClick={() => openChat(product.sellerId)} className="btn btn-primary">
        Contact Seller
      </button>
    </div>
  );
};

export default ProductCard;
