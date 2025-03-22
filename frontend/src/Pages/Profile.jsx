"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  Package,
  Heart,
  MessageSquare,
  ShoppingBag,
  LogOut,
  Camera,
  Loader,
  Info,
} from "lucide-react"
import { useAuth } from "../Context/AuthContext"

const Profile = () => {
  const navigate = useNavigate()
  const { currentUser, updateUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userListings, setUserListings] = useState([])
  const [userOrders, setUserOrders] = useState([])
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    avatar: "",
  })

  // Load user data on component mount
  useEffect(() => {
    if (currentUser) {
      // In a real app, you would fetch the complete user profile from the API
      setProfileData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        phone: "+91 98765 43210", // Sample data
        location: "Delhi, India", // Sample data
        bio: "Student at Delhi University, interested in technology and books.", // Sample data
        avatar: currentUser.avatar || "https://randomuser.me/api/portraits/men/32.jpg", // Sample data
      })

      // Fetch user listings
      fetchUserListings()

      // Fetch user orders
      fetchUserOrders()
    }
  }, [currentUser])

  // Fetch user listings (sample data)
  const fetchUserListings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Sample listings data
      const sampleListings = [
        {
          id: 1,
          title: "Dell XPS 13 Laptop",
          price: 65000,
          image: "https://v0.blob.com/laptop.png",
          status: "Available",
          views: 24,
          postedDate: "2023-06-15",
        },
        {
          id: 2,
          title: "Physics Textbook Bundle",
          price: 1200,
          image: "https://v0.blob.com/physics-books.png",
          status: "Sold",
          views: 18,
          postedDate: "2023-05-15",
        },
      ]

      setUserListings(sampleListings)
    } catch (error) {
      console.error("Error fetching user listings:", error)
      toast.error("Failed to load your listings")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch user orders (sample data)
  const fetchUserOrders = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Sample orders data
      const sampleOrders = [
        {
          id: "ORD123456",
          productTitle: "Ergonomic Desk Chair",
          price: 5000,
          image: "https://v0.blob.com/chair.png",
          status: "Delivered",
          date: "2023-06-10",
          seller: {
            name: "Priya Singh",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
          },
        },
        {
          id: "ORD789012",
          productTitle: "Calculus Textbook",
          price: 750,
          image: "https://v0.blob.com/book.png",
          status: "Processing",
          date: "2023-06-18",
          seller: {
            name: "Amit Patel",
            avatar: "https://randomuser.me/api/portraits/men/67.jpg",
          },
        },
      ]

      setUserOrders(sampleOrders)
    } catch (error) {
      console.error("Error fetching user orders:", error)
      toast.error("Failed to load your orders")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle profile data change
  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData({
      ...profileData,
      [name]: value,
    })
  }

  // Handle avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData({
          ...profileData,
          avatar: e.target.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle profile save
  const handleProfileSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update user data in context
      updateUser({
        ...currentUser,
        name: profileData.name,
        avatar: profileData.avatar,
      })

      setIsEditing(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle logout
  const handleLogout = () => {
    logout()
    navigate("/")
    toast.success("Logged out successfully")
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 text-center border-b">
              <div className="relative inline-block mb-4">
                <img
                  src={profileData.avatar || "/placeholder.svg"}
                  alt={profileData.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                />
                {isEditing && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer"
                  >
                    <Camera size={16} />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>
              <h2 className="text-xl font-semibold">{profileData.name}</h2>
              <p className="text-gray-500 text-sm">{profileData.email}</p>
            </div>

            <div className="p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                      activeTab === "profile" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                      activeTab === "listings" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab("listings")}
                  >
                    <Package className="h-5 w-5 mr-3" />
                    My Listings
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                      activeTab === "wishlist" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                    }`}
                    onClick={() => navigate("/wishlist")}
                  >
                    <Heart className="h-5 w-5 mr-3" />
                    Wishlist
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                      activeTab === "messages" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                    }`}
                    onClick={() => navigate("/messages")}
                  >
                    <MessageSquare className="h-5 w-5 mr-3" />
                    Messages
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                      activeTab === "orders" ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveTab("orders")}
                  >
                    <ShoppingBag className="h-5 w-5 mr-3" />
                    Orders
                  </button>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t">
                <button
                  className="w-full px-4 py-2 text-red-600 rounded-md hover:bg-red-50 flex items-center"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  {!isEditing ? (
                    <button
                      className="flex items-center text-blue-600 hover:text-blue-800"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                  ) : (
                    <button className="text-gray-600 hover:text-gray-800" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        disabled
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={profileData.location}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70"
                        onClick={handleProfileSave}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <Loader className="animate-spin h-4 w-4 mr-2" />
                            Saving...
                          </div>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                        <p>{profileData.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p>{profileData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                        <p>{profileData.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Location</h3>
                        <p>{profileData.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                        <p>{profileData.bio}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Listings Tab */}
            {activeTab === "listings" && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">My Listings</h2>
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => navigate("/sell")}
                  >
                    Add New Listing
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader className="h-8 w-8 text-blue-500 animate-spin" />
                  </div>
                ) : userListings.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No listings yet</h3>
                    <p className="text-gray-500 mb-4">Start selling your items today!</p>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      onClick={() => navigate("/sell")}
                    >
                      Create Listing
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Product
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Views
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userListings.map((listing) => (
                          <tr key={listing.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img
                                    className="h-10 w-10 rounded-md object-cover"
                                    src={listing.image || "/placeholder.svg"}
                                    alt={listing.title}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">₹{listing.price.toLocaleString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  listing.status === "Available"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {listing.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{listing.views}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(listing.postedDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                onClick={() => navigate(`/edit-listing/${listing.id}`)}
                              >
                                Edit
                              </button>
                              <button
                                className="text-red-600 hover:text-red-900"
                                onClick={() => {
                                  // Delete listing logic
                                  toast.success("Listing deleted")
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">My Orders</h2>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <Loader className="h-8 w-8 text-blue-500 animate-spin" />
                  </div>
                ) : userOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-4">Browse products and make your first purchase!</p>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      onClick={() => navigate("/products")}
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                          <div>
                            <span className="text-sm text-gray-500">Order ID: </span>
                            <span className="font-medium">{order.id}</span>
                          </div>
                          <div>
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 flex flex-col md:flex-row items-start">
                          <div className="w-full md:w-auto md:mr-4 mb-4 md:mb-0">
                            <img
                              src={order.image || "/placeholder.svg"}
                              alt={order.productTitle}
                              className="w-full md:w-24 h-24 object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-lg mb-1">{order.productTitle}</h3>
                            <p className="text-green-600 font-bold mb-2">₹{order.price.toLocaleString()}</p>
                            <div className="flex items-center text-sm text-gray-500 mb-4">
                              <span>Ordered on {formatDate(order.date)}</span>
                            </div>
                            <div className="flex items-center">
                              <img
                                src={order.seller.avatar || "/placeholder.svg"}
                                alt={order.seller.name}
                                className="w-6 h-6 rounded-full mr-2 object-cover"
                              />
                              <span className="text-sm text-gray-600">Seller: {order.seller.name}</span>
                            </div>
                          </div>
                          <div className="mt-4 md:mt-0 w-full md:w-auto flex flex-col space-y-2">
                            <button
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                              onClick={() => navigate(`/messages?seller=${order.seller.id}`)}
                            >
                              Contact Seller
                            </button>
                            <button
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm"
                              onClick={() => navigate(`/order/${order.id}`)}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

