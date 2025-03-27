import React, { useEffect, useState } from "react";
import axios from "axios";

const CategoryPage = ({ match }) => {
  const [products, setProducts] = useState([]);

  // Fetch products based on category
  useEffect(() => {
    const category = match.params.category;
    axios
      .get(`http://localhost:5000/api/products/category/${category}`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => console.log(error));
  }, [match.params.category]);

  return (
    <div>
      <h1>{match.params.category} Products</h1>
      <div className="product-list">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <img src={product.photos[0]} alt={product.title} />
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <span>{product.price} INR</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
