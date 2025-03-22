"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { CheckCircle, ArrowRight, Download, Share2 } from "lucide-react"
import { toast } from "react-hot-toast"

const OrderConfirmation = () => {
  const navigate = useNavigate()
  const { transactionId } = useParams()
  const location = useLocation()
  const [orderDetails, setOrderDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (location.state?.product && location.state?.transactionId) {
      setOrderDetails({
        product: location.state.product,
        paymentMethod: location.state.paymentMethod,
        transactionId: location.state.transactionId,
        amount: location.state.amount,
        date: location.state.date,
        status: "Confirmed",
      })
      setIsLoading(false)
    } else if (transactionId) {
      // Simulate API call to fetch order details
      setIsLoading(true)
      setTimeout(() => {
        // Sample order data
        const sampleOrder = {
          product: {
            id: "123",
            title: "Lenovo LOQ Intel Core i7 13th Gen",
            price: 90000,
            image: "https://v0.blob.com/laptop.png",
            condition: "Like New",
            seller: {
              id: 101,
              name: "Rahul Kumar",
              avatar: "https://randomuser.me/api/portraits/men/32.jpg",
              rating: 4.8,
            },
          },
          paymentMethod: "card",
          transactionId: transactionId,
          amount: 90000,
          date: new Date().toISOString(),
          status: "Confirmed",
        }
        setOrderDetails(sampleOrder)
        setIsLoading(false)
      }, 1000)
    } else {
      navigate("/")
      toast.error("No order details found")
    }
  }, [transactionId, location.state, navigate])

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My Order on Student Marketplace",
          text: `I just purchased ${orderDetails.product.title} for ₹${orderDetails.amount.toLocaleString()}!`,
          url: window.location.href,
        })
        .then(() => toast.success("Order shared successfully"))
        .catch((error) => console.error("Error sharing order:", error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast.success("Order link copied to clipboard")
    }
  }

  const handleDownloadInvoice = () => {
    // In a real app, this would generate and download a PDF invoice
    toast.success("Invoice download started")
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
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-green-50 border-b border-green-100 flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-green-800">Order Confirmed!</h1>
              <p className="text-green-700">Thank you for your purchase</p>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-medium">{orderDetails.transactionId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(orderDetails.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium capitalize">{orderDetails.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-green-600">{orderDetails.status}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Product</h2>

              <div className="flex items-start">
                <div className="w-24 h-24 rounded-md overflow-hidden mr-4">
                  <img
                    src={orderDetails.product.image || "/placeholder.svg"}
                    alt={orderDetails.product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{orderDetails.product.title}</h3>
                  <p className="text-sm text-gray-500">Condition: {orderDetails.product.condition}</p>
                  <div className="flex items-center mt-1">
                    <img
                      src={orderDetails.product.seller.avatar || "/placeholder.svg"}
                      alt={orderDetails.product.seller.name}
                      className="w-5 h-5 rounded-full mr-1 object-cover"
                    />
                    <span className="text-xs text-gray-500">{orderDetails.product.seller.name}</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600 mt-2">₹{orderDetails.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium mb-2">Next Steps</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center mr-3 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Contact the seller</p>
                    <p className="text-sm text-gray-600">Coordinate with the seller for product pickup or delivery</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center mr-3 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Inspect the product</p>
                    <p className="text-sm text-gray-600">
                      Verify that the product matches the description before completing the transaction
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center mr-3 mt-0.5">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Leave a review</p>
                    <p className="text-sm text-gray-600">Share your experience with the community</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Invoice
              </button>

              <button
                onClick={handleShareOrder}
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share Order
              </button>

              <button
                onClick={() => navigate(`/messages?seller=${orderDetails.product.seller.id}`)}
                className="flex items-center justify-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Contact Seller
                <ArrowRight className="h-5 w-5 ml-2" />
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button onClick={() => navigate("/")} className="text-blue-600 hover:text-blue-800 font-medium">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation

