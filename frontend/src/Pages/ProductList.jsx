"use client"

import { useState, useEffect } from "react"
import ProductCard from "./ProductCard/ProductCard"
const ProductList = ({ category, limit = 20, featured = false, recent = false }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState("newest")

  useEffect(() => {
    // Simulate API call with setTimeout
    setLoading(true)

    setTimeout(() => {
      try {
        let fetchedProducts = []

        if (featured) {
          fetchedProducts = getFeaturedProducts(limit)
        } else if (recent) {
          fetchedProducts = getRecentProducts(limit)
        } else {
          fetchedProducts = getProductsByCategory(category || "all")

          // Apply limit if specified
          if (limit && limit < fetchedProducts.length) {
            fetchedProducts = fetchedProducts.slice(0, limit)
          }
        }

        setProducts(fetchedProducts)
        setError(null)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again later.")
      } finally {
        setLoading(false)
      }
    }, 500) // Simulate network delay
  }, [category, limit, featured, recent])

  const sortProducts = (products) => {
    switch (sortBy) {
      case "price-low":
        return [...products].sort((a, b) => a.price - b.price)
      case "price-high":
        return [...products].sort((a, b) => b.price - a.price)
      case "newest":
        return [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      default:
        return products
    }
  }

  const sortedProducts = sortProducts(products)

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-64">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-danger p-4">
        <p>{error}</p>
      </div>
    )
  }

  if (sortedProducts.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted">No products found in this category.</p>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 fw-bold">
          {category ? `${category} Products` : "All Products"}
          <span className="text-muted ms-2 fs-6">({sortedProducts.length} items)</span>
        </h2>

        <div className="d-flex align-items-center">
          <label htmlFor="sort" className="form-label me-2 mb-0 small">
            Sort by:
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select form-select-sm"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {sortedProducts.map((product) => (
          <div className="col" key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductList

