import React from 'react';

const ProductCard = ({ product, showContactButton }) => {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px' }}>
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      {showContactButton && <button>Contact Seller</button>}
    </div>
  );
};

export default ProductCard;