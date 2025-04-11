
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import { Heart } from "lucide-react"

const CategoryPage = () => {
  const { categoryName } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true)
        // Fetch products by category
        const response = await axios.get(`http://localhost:5000/api/products/category/${categoryName}`)

        if (Array.isArray(response.data)) {
          setProducts(response.data)
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching category products:", err)
        setError("Failed to load products for this category")
        setLoading(false)
        toast.error("Failed to load products for this category")
      }
    }

    fetchCategoryProducts()

    // Check if user is logged in
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist) || [])
    }
  }, [categoryName])

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist))
  }, [wishlist])

  const handleAddToWishlist = (product, e) => {
    e.stopPropagation() // Prevent the product click event

    // Check if user is logged in
    if (!isLoggedIn) {
      toast.error("Please login to add items to your wishlist")
      return
    }

    // Check if product is already in wishlist
    const isInWishlist = wishlist.some((item) => item._id === product._id)

    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter((item) => item._id !== product._id)
      setWishlist(updatedWishlist)
      toast.success(`${product.title} removed from wishlist`)
    } else {
      // Add to wishlist
      setWishlist([...wishlist, product])
      toast.success(`${product.title} added to wishlist`)
    }
  }

  // Check if a product is in the wishlist
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId)
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4">Products in {categoryName}</h1>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No products found in this category.
        </div>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-img-top-container">
                  {product.photos && product.photos.length > 0 ? (
                    <img
                      src={`http://localhost:5000/uploads/${product.photos[0]}`}
                      className="card-img-top"
                      alt={product.title}
                      style={{ height: "200px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "https://via.placeholder.com/200"
                      }}
                    />
                  ) : (
                    <div className="no-image-placeholder">No Image</div>
                  )}
                  <button
                    className={`wishlist-button ${isInWishlist(product._id) ? "active" : ""}`}
                    onClick={(e) => handleAddToWishlist(product, e)}
                    aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart size={20} color="#ff4d4d" fill={isInWishlist(product._id) ? "#ff4d4d" : "none"} />
                  </button>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text text-primary fw-bold">₹{product.price}</p>
                  <p className="card-text">
                    {product.description.length > 100
                      ? `${product.description.substring(0, 100)}...`
                      : product.description}
                  </p>
                  <div className="d-flex justify-content-between">
                    <Link to={`/product/${product._id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryPage

