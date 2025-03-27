import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${productId}`);
        setProduct(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product", error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return (
    <div className="container mt-5">
      {loading ? (
        <p>Loading...</p>
      ) : product ? (
        <div className="row">
          <div className="col-md-6">
            <img src={product.photos[0]} alt={product.title} className="img-fluid" />
          </div>
          <div className="col-md-6">
            <h2>{product.title}</h2>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Price:</strong> ₹{product.price}</p>
            <p><strong>Condition:</strong> {product.condition}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Location:</strong> {product.location}</p>
            <button className="btn btn-success">Contact Seller</button>
          </div>
        </div>
      ) : (
        <p>Product not found.</p>
      )}
    </div>
  );
};

export default ProductDetail;
