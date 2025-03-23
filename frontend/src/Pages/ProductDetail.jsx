"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { FaHeart, FaRegHeart, FaShoppingCart, FaPhone, FaUniversity, FaMapMarkerAlt } from "react-icons/fa"
import { useAuth } from "../Context/AuthContext"
import { toast } from "react-hot-toast"
import ProductCard from "../Components/ProductCard/ProductCard" 

const ProductDetail = () => {
  const { id } = useParams()
  const { user, isAuthenticated } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [similarProducts, setSimilarProducts] = useState([])

  // Sample data for illustration
  const sampleProducts = [
    { _id: "1", title: "Product 1", price: 100, category: "Electronics", images: [], condition: "New", description: "This is product 1", tags: [], seller: "Seller 1", location: "Pune", sellerUniversity: "XYZ University", sellerPhone: "1234567890", pinCode: "411001" },
    { _id: "2", title: "Product 2", price: 200, category: "Electronics", images: [], condition: "Used", description: "This is product 2", tags: [], seller: "Seller 2", location: "Pune", sellerUniversity: "ABC University", sellerPhone: "9876543210", pinCode: "411002" },
    // Add more products as needed
  ];

  // Fetch product by ID
  const getProductById = (id) => {
    return sampleProducts.find((product) => product._id === id);
  };

  // Fetch products by category
  const getProductsByCategory = (category) => {
    return sampleProducts.filter((product) => product.category === category);
  };

  useEffect(() => {
    // Simulate API call with setTimeout
    setLoading(true)

    setTimeout(() => {
      try {
        const fetchedProduct = getProductById(id)

        if (!fetchedProduct) {
          setError("Product not found")
        } else {
          setProduct(fetchedProduct)

          // Get similar products (same category, excluding current product)
          const categoryProducts = getProductsByCategory(fetchedProduct.category)
          const filtered = categoryProducts.filter((p) => p._id !== id)
          setSimilarProducts(filtered.slice(0, 4)) // Get up to 4 similar products
        }
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Failed to load product details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }, 500) // Simulate network delay
  }, [id])

  const handleAddToWishlist = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your wishlist")
      return
    }

    setIsInWishlist(true)
    toast.success("Added to wishlist!")
  }

  const handleRemoveFromWishlist = () => {
    if (!isAuthenticated) return

    setIsInWishlist(false)
    toast.success("Removed from wishlist!")
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your cart")
      return
    }

    toast.success("Added to cart!")
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || "Product not found"}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Images */}
          <div className="md:w-1/2">
            <div className="h-96 overflow-hidden">
              <img
                src={product.images[selectedImage] || "/placeholder-image.jpg"}
                alt={product.title}
                className="w-full h-full object-contain"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex p-4 space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded border-2 overflow-hidden ${selectedImage === index ? "border-blue-500" : "border-gray-200"}`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
              <button
                onClick={isInWishlist ? handleRemoveFromWishlist : handleAddToWishlist}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                {isInWishlist ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
              </button>
            </div>

            <p className="text-3xl font-bold text-blue-600 mt-4">₹{product.price.toFixed(2)}</p>

            <div className="flex items-center mt-4 space-x-4">
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{product.condition}</span>
              <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{product.category}</span>
              {product.subcategory && (
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">{product.subcategory}</span>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="text-gray-600 mt-2">{product.description}</p>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6">
              <h2 className="text-lg font-semibold">Seller Information</h2>
              <div className="mt-2 space-y-2">
                <p className="flex items-center text-gray-600">
                  <span className="w-8">
                    <FaMapMarkerAlt />
                  </span>
                  {product.location} ({product.pinCode})
                </p>
                <p className="flex items-center text-gray-600">
                  <span className="w-8">
                    <FaUniversity />
                  </span>
                  {product.sellerUniversity}
                </p>
                <p className="flex items-center text-gray-600">
                  <span className="w-8">
                    <FaPhone />
                  </span>
                  {product.sellerPhone}
                </p>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md transition-colors flex items-center justify-center"
              >
                <FaShoppingCart className="mr-2" /> Add to Cart
              </button>

              <Link
                to={`/messages/new?seller=${product.seller}`}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md transition-colors flex items-center justify-center"
              >
                <FaPhone className="mr-2" /> Contact Seller
              </Link>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="bg-gray-50 p-8 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800">Similar Products</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <ProductCard key={similarProduct._id} product={similarProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
