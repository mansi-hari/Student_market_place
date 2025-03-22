"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MapPin, List, MapIcon, Loader } from "lucide-react"
import { toast } from "react-hot-toast"
import LocationSearch from "../Components/LocationSearch"
import ProductsMap from "../Components/ProductsMap"
import { calculateDistance } from "../utils/geocodingService"

const NearbyProducts = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchParams, setSearchParams] = useState(null)
  const [viewMode, setViewMode] = useState("list") // 'list' or 'map'

  // Fetch products on component mount
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Sample product data with location
        const sampleProducts = [
          {
            id: 1,
            title: "Dell XPS 13 Laptop",
            price: 65000,
            image: "https://v0.blob.com/laptop.png",
            description: "Like new, includes charger",
            category: "electronics",
            condition: "Like New",
            location: {
              formattedAddress: "IIT Delhi, Hauz Khas, New Delhi, Delhi 110016",
              coordinates: { latitude: 28.5459, longitude: 77.1926 },
            },
            seller: {
              id: 101,
              name: "Rahul Kumar",
              avatar: "https://randomuser.me/api/portraits/men/32.jpg",
              rating: 4.8,
            },
          },
          {
            id: 2,
            title: "Ergonomic Desk Chair",
            price: 5000,
            image: "https://v0.blob.com/chair.png",
            description: "Great condition, very comfortable",
            category: "furniture",
            condition: "Good",
            location: {
              formattedAddress: "Jawaharlal Nehru University, New Delhi, Delhi 110067",
              coordinates: { latitude: 28.5403, longitude: 77.1675 },
            },
            seller: {
              id: 102,
              name: "Priya Singh",
              avatar: "https://randomuser.me/api/portraits/women/44.jpg",
              rating: 4.5,
            },
          },
          {
            id: 3,
            title: "Calculus Textbook",
            price: 750,
            image: "https://v0.blob.com/book.png",
            description: "Calculus: Early Transcendentals, 8th Edition",
            category: "books",
            condition: "Good",
            location: {
              formattedAddress: "Delhi University North Campus, Delhi 110007",
              coordinates: { latitude: 28.6889, longitude: 77.2099 },
            },
            seller: {
              id: 103,
              name: "Amit Patel",
              avatar: "https://randomuser.me/api/portraits/men/67.jpg",
              rating: 4.9,
            },
          },
          {
            id: 4,
            title: "Mountain Bike",
            price: 12000,
            image: "https://v0.blob.com/bike.png",
            description: "Well-maintained mountain bike, perfect for campus commuting",
            category: "transport",
            condition: "Good",
            location: {
              formattedAddress: "Jamia Millia Islamia, Jamia Nagar, New Delhi, Delhi 110025",
              coordinates: { latitude: 28.5619, longitude: 77.2811 },
            },
            seller: {
              id: 104,
              name: "Sneha Gupta",
              avatar: "https://randomuser.me/api/portraits/women/22.jpg",
              rating: 4.7,
            },
          },
          {
            id: 5,
            title: "Study Desk",
            price: 3500,
            image: "https://v0.blob.com/desk.png",
            description: "Sturdy study desk with drawer",
            category: "furniture",
            condition: "Excellent",
            location: {
              formattedAddress: "Amity University, Sector 125, Noida, Uttar Pradesh 201313",
              coordinates: { latitude: 28.5445, longitude: 77.3326 },
            },
            seller: {
              id: 105,
              name: "Vikram Sharma",
              avatar: "https://randomuser.me/api/portraits/men/45.jpg",
              rating: 4.6,
            },
          },
        ]

        setProducts(sampleProducts)
        setFilteredProducts(sampleProducts)
      } catch (error) {
        console.error("Error fetching products:", error)
        toast.error("Failed to load products")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Handle location search
  const handleSearch = (params) => {
    setSearchParams(params)

    if (params && params.coordinates && products.length > 0) {
      // Filter products by distance
      const filtered = products.filter((product) => {
        if (!product.location || !product.location.coordinates) return false

        const distance = calculateDistance(params.coordinates, product.location.coordinates)

        // Add distance to product for display
        product.distance = distance

        // Filter by radius
        return distance <= params.radius
      })

      // Sort by distance
      filtered.sort((a, b) => a.distance - b.distance)

      setFilteredProducts(filtered)

      if (filtered.length === 0) {
        toast.info(`No products found within ${params.radius} km of ${params.address}`)
      } else {
        toast.success(`Found ${filtered.length} products near ${params.address}`)
      }
    }
  }

  // Handle product selection
  const handleProductSelect = (product) => {
    navigate(`/products/${product.category}/${product.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Products Near You</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <LocationSearch onSearch={handleSearch} />

          {searchParams && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-700">Search Area</p>
                  <p className="text-sm text-blue-600">{searchParams.address}</p>
                  <p className="text-sm text-blue-600">Radius: {searchParams.radius} km</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {searchParams && (
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">{filteredProducts.length} Products Found</h2>
              <div className="flex space-x-2">
                <button
                  className={`p-2 rounded-md ${viewMode === "list" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-5 w-5" />
                </button>
                <button
                  className={`p-2 rounded-md ${viewMode === "map" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
                  onClick={() => setViewMode("map")}
                >
                  <MapIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <>
              {!searchParams ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Search for Products</h3>
                  <p className="text-gray-500">Use the search panel to find products near your location.</p>
                </div>
              ) : viewMode === "list" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleProductSelect(product)}
                    >
                      <div className="relative h-48">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
                        <p className="text-green-600 font-bold mb-2">₹{product.price.toLocaleString()}</p>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{product.distance.toFixed(1)} km away</span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                        <div className="flex items-center mt-3">
                          <img
                            src={product.seller.avatar || "/placeholder.svg"}
                            alt={product.seller.name}
                            className="w-6 h-6 rounded-full mr-2"
                          />
                          <span className="text-xs text-gray-500">{product.seller.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredProducts.length === 0 && (
                    <div className="col-span-full bg-gray-50 rounded-lg p-8 text-center">
                      <h3 className="text-lg font-medium text-gray-700 mb-2">No Products Found</h3>
                      <p className="text-gray-500">
                        Try increasing your search radius or searching in a different location.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <ProductsMap
                  products={filteredProducts}
                  userLocation={searchParams.coordinates}
                  onProductSelect={handleProductSelect}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default NearbyProducts

