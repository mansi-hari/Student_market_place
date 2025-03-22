"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import { toast } from "react-hot-toast"
import { useAuth } from "../Context/AuthContext"
import { CreditCard, Check, Shield, AlertCircle, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"

const Checkout = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const { productId } = useParams()
  const location = useLocation()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
  })
  const [upiId, setUpiId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showOrderSummary, setShowOrderSummary] = useState(true)
  const [billingAddress, setBillingAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
  })
  const [errors, setErrors] = useState({})

  // Get product data from location state or fetch it
  useEffect(() => {
    if (location.state?.product) {
      setProduct(location.state.product)
      setIsLoading(false)
    } else if (productId) {
      // Simulate API call to fetch product
      setIsLoading(true)
      setTimeout(() => {
        // Sample product data
        const sampleProduct = {
          id: productId,
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
          description:
            "High-performance gaming laptop with latest Intel processor, perfect for gaming and content creation.",
        }
        setProduct(sampleProduct)
        setIsLoading(false)
      }, 1000)
    } else {
      navigate("/")
      toast.error("No product selected for checkout")
    }
  }, [productId, location.state, navigate])

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "")
    // Add spaces after every 4 digits
    value = value.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
    // Limit to 19 characters (16 digits + 3 spaces)
    value = value.substring(0, 19)

    setCardDetails({ ...cardDetails, number: value })

    // Clear error when user starts typing
    if (errors.cardNumber) {
      setErrors({ ...errors, cardNumber: "" })
    }
  }

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "")

    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4)
    }

    setCardDetails({ ...cardDetails, expiry: value })

    // Clear error when user starts typing
    if (errors.expiry) {
      setErrors({ ...errors, expiry: "" })
    }
  }

  const handleCvcChange = (e) => {
    let value = e.target.value.replace(/\D/g, "")
    value = value.substring(0, 3)

    setCardDetails({ ...cardDetails, cvc: value })

    // Clear error when user starts typing
    if (errors.cvc) {
      setErrors({ ...errors, cvc: "" })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (paymentMethod === "card") {
      // Validate card number (should be 16 digits)
      const cardNumberDigits = cardDetails.number.replace(/\s/g, "")
      if (!cardNumberDigits) {
        newErrors.cardNumber = "Card number is required"
      } else if (cardNumberDigits.length !== 16) {
        newErrors.cardNumber = "Card number should be 16 digits"
      }

      // Validate expiry date (should be in MM/YY format)
      if (!cardDetails.expiry) {
        newErrors.expiry = "Expiry date is required"
      } else if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
        newErrors.expiry = "Expiry date should be in MM/YY format"
      } else {
        const [month, year] = cardDetails.expiry.split("/")
        const currentYear = new Date().getFullYear() % 100
        const currentMonth = new Date().getMonth() + 1

        if (Number.parseInt(month) < 1 || Number.parseInt(month) > 12) {
          newErrors.expiry = "Invalid month"
        } else if (
          Number.parseInt(year) < currentYear ||
          (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
        ) {
          newErrors.expiry = "Card has expired"
        }
      }

      // Validate CVC (should be 3 digits)
      if (!cardDetails.cvc) {
        newErrors.cvc = "CVC is required"
      } else if (cardDetails.cvc.length !== 3) {
        newErrors.cvc = "CVC should be 3 digits"
      }

      // Validate card holder name
      if (!cardDetails.name.trim()) {
        newErrors.name = "Cardholder name is required"
      }
    } else if (paymentMethod === "upi") {
      // Validate UPI ID
      if (!upiId.trim()) {
        newErrors.upiId = "UPI ID is required"
      } else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId)) {
        newErrors.upiId = "Invalid UPI ID format"
      }
    }

    // Validate billing address
    if (!billingAddress.line1.trim()) {
      newErrors.line1 = "Address line 1 is required"
    }

    if (!billingAddress.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!billingAddress.state.trim()) {
      newErrors.state = "State is required"
    }

    if (!billingAddress.postal_code.trim()) {
      newErrors.postal_code = "Postal code is required"
    } else if (!/^\d{6}$/.test(billingAddress.postal_code)) {
      newErrors.postal_code = "Postal code should be 6 digits"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate a random transaction ID
      const transactionId = Math.random().toString(36).substring(2, 15)

      // Simulate successful payment
      toast.success("Payment successful!")

      // Navigate to order confirmation page
      navigate(`/order-confirmation/${transactionId}`, {
        state: {
          product,
          paymentMethod,
          transactionId,
          amount: product.price,
          date: new Date().toISOString(),
        },
      })
    } catch (error) {
      toast.error("Payment failed. Please try again.")
      console.error("Payment error:", error)
    } finally {
      setIsProcessing(false)
    }
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
      <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Payment Details</h2>

              <form onSubmit={handleSubmit}>
                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        paymentMethod === "card" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                            paymentMethod === "card" ? "border-blue-500" : "border-gray-300"
                          }`}
                        >
                          {paymentMethod === "card" && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                          <span>Credit/Debit Card</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        paymentMethod === "upi" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                      onClick={() => setPaymentMethod("upi")}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                            paymentMethod === "upi" ? "border-blue-500" : "border-gray-300"
                          }`}
                        >
                          {paymentMethod === "upi" && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                        </div>
                        <span>UPI</span>
                      </div>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        paymentMethod === "cod" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                      onClick={() => setPaymentMethod("cod")}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                            paymentMethod === "cod" ? "border-blue-500" : "border-gray-300"
                          }`}
                        >
                          {paymentMethod === "cod" && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                        </div>
                        <span>Cash on Delivery</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          id="card-number"
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className={`w-full px-4 py-2 border rounded-md ${
                            errors.cardNumber ? "border-red-300" : "border-gray-300"
                          }`}
                          value={cardDetails.number}
                          onChange={handleCardNumberChange}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <img src="/visa-mastercard.svg" alt="Card types" className="h-6" />
                        </div>
                      </div>
                      {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiry" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          id="expiry"
                          type="text"
                          placeholder="MM/YY"
                          className={`w-full px-4 py-2 border rounded-md ${
                            errors.expiry ? "border-red-300" : "border-gray-300"
                          }`}
                          value={cardDetails.expiry}
                          onChange={handleExpiryChange}
                        />
                        {errors.expiry && <p className="mt-1 text-sm text-red-600">{errors.expiry}</p>}
                      </div>

                      <div>
                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                          CVC
                        </label>
                        <input
                          id="cvc"
                          type="text"
                          placeholder="123"
                          className={`w-full px-4 py-2 border rounded-md ${
                            errors.cvc ? "border-red-300" : "border-gray-300"
                          }`}
                          value={cardDetails.cvc}
                          onChange={handleCvcChange}
                        />
                        {errors.cvc && <p className="mt-1 text-sm text-red-600">{errors.cvc}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className={`w-full px-4 py-2 border rounded-md ${
                          errors.name ? "border-red-300" : "border-gray-300"
                        }`}
                        value={cardDetails.name}
                        onChange={(e) => {
                          setCardDetails({ ...cardDetails, name: e.target.value })
                          if (errors.name) {
                            setErrors({ ...errors, name: "" })
                          }
                        }}
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>
                  </div>
                )}

                {/* UPI Payment Form */}
                {paymentMethod === "upi" && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="upi-id" className="block text-sm font-medium text-gray-700 mb-1">
                        UPI ID
                      </label>
                      <input
                        id="upi-id"
                        type="text"
                        placeholder="username@upi"
                        className={`w-full px-4 py-2 border rounded-md ${
                          errors.upiId ? "border-red-300" : "border-gray-300"
                        }`}
                        value={upiId}
                        onChange={(e) => {
                          setUpiId(e.target.value)
                          if (errors.upiId) {
                            setErrors({ ...errors, upiId: "" })
                          }
                        }}
                      />
                      {errors.upiId && <p className="mt-1 text-sm text-red-600">{errors.upiId}</p>}
                    </div>

                    <div className="flex items-center p-4 bg-blue-50 rounded-md">
                      <div className="flex-shrink-0 mr-3">
                        <img src="/upi-apps.svg" alt="UPI Apps" className="h-10" />
                      </div>
                      <p className="text-sm text-gray-600">
                        You will receive a payment request on your UPI app. Please complete the payment within 5
                        minutes.
                      </p>
                    </div>
                  </div>
                )}

                {/* Cash on Delivery */}
                {paymentMethod === "cod" && (
                  <div className="p-4 bg-yellow-50 rounded-md mb-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-700 font-medium">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">
                          Pay with cash when the product is delivered to you. A convenience fee of ₹50 will be added.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Billing Address */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Billing Address</h3>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="address-line1" className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1
                      </label>
                      <input
                        id="address-line1"
                        type="text"
                        placeholder="Street address, apartment, suite, etc."
                        className={`w-full px-4 py-2 border rounded-md ${
                          errors.line1 ? "border-red-300" : "border-gray-300"
                        }`}
                        value={billingAddress.line1}
                        onChange={(e) => {
                          setBillingAddress({ ...billingAddress, line1: e.target.value })
                          if (errors.line1) {
                            setErrors({ ...errors, line1: "" })
                          }
                        }}
                      />
                      {errors.line1 && <p className="mt-1 text-sm text-red-600">{errors.line1}</p>}
                    </div>

                    <div>
                      <label htmlFor="address-line2" className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        id="address-line2"
                        type="text"
                        placeholder="Building, floor, landmark, etc."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        value={billingAddress.line2}
                        onChange={(e) => setBillingAddress({ ...billingAddress, line2: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          id="city"
                          type="text"
                          placeholder="City"
                          className={`w-full px-4 py-2 border rounded-md ${
                            errors.city ? "border-red-300" : "border-gray-300"
                          }`}
                          value={billingAddress.city}
                          onChange={(e) => {
                            setBillingAddress({ ...billingAddress, city: e.target.value })
                            if (errors.city) {
                              setErrors({ ...errors, city: "" })
                            }
                          }}
                        />
                        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          id="state"
                          type="text"
                          placeholder="State"
                          className={`w-full px-4 py-2 border rounded-md ${
                            errors.state ? "border-red-300" : "border-gray-300"
                          }`}
                          value={billingAddress.state}
                          onChange={(e) => {
                            setBillingAddress({ ...billingAddress, state: e.target.value })
                            if (errors.state) {
                              setErrors({ ...errors, state: "" })
                            }
                          }}
                        />
                        {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="postal-code" className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code
                        </label>
                        <input
                          id="postal-code"
                          type="text"
                          placeholder="Postal Code"
                          className={`w-full px-4 py-2 border rounded-md ${
                            errors.postal_code ? "border-red-300" : "border-gray-300"
                          }`}
                          value={billingAddress.postal_code}
                          onChange={(e) => {
                            setBillingAddress({ ...billingAddress, postal_code: e.target.value })
                            if (errors.postal_code) {
                              setErrors({ ...errors, postal_code: "" })
                            }
                          }}
                        />
                        {errors.postal_code && <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>}
                      </div>

                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                          Country
                        </label>
                        <select
                          id="country"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md"
                          value={billingAddress.country}
                          onChange={(e) => setBillingAddress({ ...billingAddress, country: e.target.value })}
                        >
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      isProcessing ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </div>
                    ) : (
                      `Pay ₹${product.price.toLocaleString()}`
                    )}
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
                  <Shield className="h-4 w-4 mr-1" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-8">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Order Summary</h2>
                <button className="lg:hidden text-gray-500" onClick={() => setShowOrderSummary(!showOrderSummary)}>
                  {showOrderSummary ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </button>
              </div>

              <div className={`${showOrderSummary ? "block" : "hidden lg:block"}`}>
                <div className="flex items-start mb-4">
                  <div className="w-20 h-20 rounded-md overflow-hidden mr-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{product.title}</h3>
                    <p className="text-sm text-gray-500">Condition: {product.condition}</p>
                    <div className="flex items-center mt-1">
                      <img
                        src={product.seller.avatar || "/placeholder.svg"}
                        alt={product.seller.name}
                        className="w-5 h-5 rounded-full mr-1 object-cover"
                      />
                      <span className="text-xs text-gray-500">{product.seller.name}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Product Price</span>
                    <span>₹{product.price.toLocaleString()}</span>
                  </div>

                  {paymentMethod === "cod" && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Convenience Fee</span>
                      <span>₹50</span>
                    </div>
                  )}

                  <div className="flex justify-between font-medium text-lg mt-4 pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span>₹{(product.price + (paymentMethod === "cod" ? 50 : 0)).toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Buyer Protection</h3>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Get full refund if item is not as described</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>Secure payments processed by trusted partners</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span>24/7 customer support</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

