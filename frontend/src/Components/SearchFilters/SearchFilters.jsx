"use client"

import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useMarketplace } from "../../Context/MarketplaceContext"
import "./SearchFilters.css"

const SearchFilters = ({ initialFilters = {} }) => {
  const { categories } = useMarketplace()
  const navigate = useNavigate()
  const location = useLocation()

  const [filters, setFilters] = useState({
    category: initialFilters.category || "",
    minPrice: initialFilters.minPrice || "",
    maxPrice: initialFilters.maxPrice || "",
    condition: initialFilters.condition || "",
    sortBy: initialFilters.sortBy || "newest",
    ...initialFilters,
  })

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  // Apply filters
  const applyFilters = () => {
    // Build query string from filters
    const queryParams = new URLSearchParams()

    // Add search term if it exists in current URL
    const currentParams = new URLSearchParams(location.search)
    const searchTerm = currentParams.get("search")
    if (searchTerm) {
      queryParams.set("search", searchTerm)
    }

    // Add filters
    if (filters.category) queryParams.set("category", filters.category)
    if (filters.minPrice) queryParams.set("minPrice", filters.minPrice)
    if (filters.maxPrice) queryParams.set("maxPrice", filters.maxPrice)
    if (filters.condition) queryParams.set("condition", filters.condition)
    if (filters.sortBy) queryParams.set("sortBy", filters.sortBy)

    // Navigate to products page with filters
    navigate(`/products?${queryParams.toString()}`)
  }

  // Clear filters
  const clearFilters = () => {
    // Keep only search term if it exists
    const queryParams = new URLSearchParams()
    const currentParams = new URLSearchParams(location.search)
    const searchTerm = currentParams.get("search")

    if (searchTerm) {
      queryParams.set("search", searchTerm)
      navigate(`/products?${queryParams.toString()}`)
    } else {
      navigate("/products")
    }

    // Reset filter state
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      condition: "",
      sortBy: "newest",
    })
  }

  return (
    <div className="search-filters card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Filters</h5>
        <button className="btn btn-sm btn-link text-decoration-none" onClick={clearFilters}>
          Clear All
        </button>
      </div>

      <div className="card-body">
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Price Range</label>
          <div className="row g-2">
            <div className="col-6">
              <input
                type="number"
                name="minPrice"
                className="form-control"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-6">
              <input
                type="number"
                name="maxPrice"
                className="form-control"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="condition" className="form-label">
            Condition
          </label>
          <select
            id="condition"
            name="condition"
            className="form-select"
            value={filters.condition}
            onChange={handleFilterChange}
          >
            <option value="">Any Condition</option>
            <option value="New">New</option>
            <option value="Like New">Like New</option>
            <option value="Good">Good</option>
            <option value="Fair">Fair</option>
            <option value="Poor">Poor</option>
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="sortBy" className="form-label">
            Sort By
          </label>
          <select
            id="sortBy"
            name="sortBy"
            className="form-select"
            value={filters.sortBy}
            onChange={handleFilterChange}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>

        <button className="btn btn-primary w-100" onClick={applyFilters}>
          Apply Filters
        </button>
      </div>
    </div>
  )
}

export default SearchFilters

