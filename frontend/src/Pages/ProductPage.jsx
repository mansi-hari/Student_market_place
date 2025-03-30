
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const ProductPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:5000/api/products")
        console.log("Products response:", response.data)
        setProducts(response.data || [])
        setLoading(false)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again later.")
        setLoading(false)
        toast.error("Failed to load products")
      }
    }

    fetchProducts()
  }, [])

  return null // No product display on this page
}

export default ProductPage
