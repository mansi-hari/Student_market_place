
import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const url = process.env.REACT_APP_API_URL;
const ProductPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${url}/api/products`)
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

  return null 
}

export default ProductPage
