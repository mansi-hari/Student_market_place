"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import axios from "axios"
import ProductCard from "./ProductCard"
import { getSelectedLocation } from "../utils/locationService"
import "./ProductList.css"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

const ProductList = ({ category, limit = 20, featured = false, recent = false }) => {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sortBy, setSortBy] = useState("newest")
  const [selectedLocation, setSelectedLocation] = useState(null)

  // Get search parameters
  const searchQuery = searchParams.get("search") || ""
  const locationParam = searchParams.get("location") || ""

  useEffect(() => {
    // Get selected location from localStorage
    const savedLocation = getSelectedLocation()
    if (savedLocation) {
      setSelectedLocation(savedLocation)
    }
  }, [])

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // Build query parameters
        const params = new URLSearchParams()

        if (category && category !== "all") {
          params.set("category", category)
        }

        if (limit) {
          params.set("limit", limit.toString())
        }

        if (featured) {
          params.set("featured", "true")
        }

        if (recent) {
          params.set("sort", "newest")
        }

        if (searchQuery) {
          params.set("search", searchQuery)
        }

        // Use location from URL parameter or selected location
        const locationFilter = locationParam || (selectedLocation ? selectedLocation.pinCode : null)
        if (locationFilter) {
          params.set("location", locationFilter)
        }

        // Make API request
        const response = await axios.get(`${API_URL}/api/products?${params.toString()}`)
        setProducts(response.data)
        setError(null)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again later.")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, limit, featured, recent, searchQuery, locationParam, selectedLocation])

  // Apply client-side sorting
  useEffect(() => {
    const result = [...products]

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      default:
        break
    }

    setFilteredProducts(result)
  }, [products, sortBy])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    )
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="no-products-container">
        <p>
          No products found{searchQuery ? ` for "${searchQuery}"` : ""}
          {selectedLocation ? ` in ${selectedLocation.name}` : ""}.
        </p>
        {(searchQuery || selectedLocation) && <p>Try adjusting your search criteria or location.</p>}
      </div>
    )
  }

  return (
    <div className="product-list-container">
      <div className="product-list-header">
        <div className="product-count">
          <h2>
            {category ? `${category} Products` : "All Products"}
            <span className="product-count-badge">{filteredProducts.length} items</span>
          </h2>

          {selectedLocation && <div className="location-filter-badge">Showing products in {selectedLocation.name}</div>}
        </div>

        <div className="sort-container">
          <label htmlFor="sort">Sort by:</label>
          <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ProductList

