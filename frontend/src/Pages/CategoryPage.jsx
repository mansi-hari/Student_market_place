
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Heart } from "lucide-react"
import { toast } from "react-hot-toast"

const CategoryPage = () => {
  const { category } = useParams()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Sample category data - in a real app, this would come from an API
  const categoryData = {
    transport: [
      {
        id: 1,
        title: "2017 Hero Duet VX",
        price: 45000,
        details: {
          km: "9,000 km",
          fuel: "Petrol",
          condition: "First",
        },
        images: [
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-15%20191658-EL7VBG0gnNhvvSxrJNHBqR8Z4S3ZNK.png",
        ],
        seller: {
          id: 1,
          name: "Rahul Kumar",
          rating: 4.5,
          memberSince: "2023",
          location: "Delhi",
          phone: "+91-9876543210",
        },
      },
      {
        id: 2,
        title: "2018 TVS Jupiter Disc",
        price: 50000,
        details: {
          km: "6,200 km",
          fuel: "Petrol",
          condition: "First",
        },
        images: [
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-15%20191658-EL7VBG0gnNhvvSxrJNHBqR8Z4S3ZNK.png",
        ],
        additionalImages: 2,
        seller: {
          id: 2,
          name: "Priya Singh",
          rating: 4.8,
          memberSince: "2022",
          location: "Mumbai",
          phone: "+91-9876543211",
        },
      },
      {
        id: 3,
        title: "2015 Piaggio Vespa S 125",
        price: 50000,
        details: {
          km: "37,000 km",
          fuel: "Petrol",
          condition: "First",
        },
        images: [
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-03-15%20191658-EL7VBG0gnNhvvSxrJNHBqR8Z4S3ZNK.png",
        ],
        additionalImages: 4,
        seller: {
          id: 3,
          name: "Amit Patel",
          rating: 4.2,
          memberSince: "2021",
          location: "Bangalore",
          phone: "+91-9876543212",
        },
      },
    ],
  }

  useEffect(() => {
    // Simulate API call
    setIsLoading(true)
    setTimeout(() => {
      setProducts(categoryData[category] || [])
      setIsLoading(false)
    }, 500)

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem("wishlist")
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist))
    }
  }, [category])

  const handleWishlist = (product) => {
    const isInWishlist = wishlist.some((item) => item.id === product.id)
    let newWishlist

    if (isInWishlist) {
      newWishlist = wishlist.filter((item) => item.id !== product.id)
      toast.success(`${product.title} removed from wishlist`)
    } else {
      newWishlist = [...wishlist, product]
      toast.success(`${product.title} added to wishlist`)
    }

    setWishlist(newWishlist)
    localStorage.setItem("wishlist", JSON.stringify(newWishlist))
  }

  const handleViewDetails = (productId) => {
    navigate(`/products/${category}/${productId}`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">{category}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={product.images[0] || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              {product.additionalImages > 0 && (
                <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                  +{product.additionalImages} photos
                </span>
              )}
            </div>

            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>

              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold">₹{product.price.toLocaleString()}*</span>
                <button
                  onClick={() => handleWishlist(product)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Heart
                    className={`h-6 w-6 ${
                      wishlist.some((item) => item.id === product.id) ? "fill-red-500 text-red-500" : "text-gray-500"
                    }`}
                  />
                </button>
              </div>

              <div className="flex gap-4 text-sm text-gray-600 mb-4">
                <span>{product.details.km}</span>
                <span>•</span>
                <span>{product.details.fuel}</span>
                <span>•</span>
                <span>{product.details.condition}</span>
              </div>

              <button
                onClick={() => handleViewDetails(product.id)}
                className="w-full py-2 px-4 bg-white border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
              >
                View Seller Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryPage

