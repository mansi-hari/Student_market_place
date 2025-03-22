import { useState, useEffect } from "react";

const ProductList = ({ category }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${category}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [category]);

  return (
    <div className="featured-listings">
      {products.length > 0 ? (
        products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={`/images/${product.image}`} alt={product.title} />
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <span>₹{product.price}</span>
            <small>Seller: {product.seller}</small>
            <p>Location: {product.location}</p>
            <p>Views: {product.views}</p>
            <p>{product.isSold ? "Sold" : "Available"}</p>
          </div>
        ))
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
};

export default ProductList;
