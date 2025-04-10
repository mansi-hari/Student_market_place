

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaEdit,
  FaShoppingBag,
  FaHeart,
  FaComments,
} from "react-icons/fa"
import "./ProfilePage.css"

const ProfilePage = () => {
  const { userId } = useParams()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("listings")
  const [listings, setListings] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCurrentUser, setIsCurrentUser] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
      
        // Check if this is the current user's profile
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
        const isCurrentUserProfile = currentUser._id === userId || !userId
        setIsCurrentUser(isCurrentUserProfile)

        // Mock user data
        const mockUser = {
          _id: isCurrentUserProfile ? currentUser._id || "1" : userId,
          name: isCurrentUserProfile ? currentUser.name || "John Doe" : "Jane Smith",
          email: isCurrentUserProfile ? currentUser.email || "john@example.com" : "jane@example.com",
          phone: "+91 9876543210",
          location: "Mumbai, Maharashtra",
          joinedDate: "2023-01-15T10:30:00Z",
          bio: "Student at Mumbai University. Interested in technology and books.",
          profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
        }

        // Mock listings data
        const mockListings = [
          {
            _id: "1",
            title: "HP Laptop",
            category: "Electronics",
            price: 25000,
            photos: ["laptop.jpg"],
            createdAt: "2023-05-15T10:30:00Z",
          },
          {
            _id: "2",
            title: "Study Table",
            category: "Furniture",
            price: 1500,
            photos: ["table.jpg"],
            createdAt: "2023-05-14T09:20:00Z",
          },
          {
            _id: "3",
            title: "Physics Textbook",
            category: "Books",
            price: 350,
            photos: ["book.jpg"],
            createdAt: "2023-05-13T14:45:00Z",
          },
        ]

        // Mock wishlist data
        const mockWishlist = [
          {
            _id: "4",
            title: "Bicycle",
            category: "Transport",
            price: 3000,
            photos: ["bicycle.jpg"],
            createdAt: "2023-05-12T11:10:00Z",
          },
          {
            _id: "5",
            title: "Scientific Calculator",
            category: "Electronics",
            price: 800,
            photos: ["calculator.jpg"],
            createdAt: "2023-05-11T16:30:00Z",
          },
        ]

        setUser(mockUser)
        setListings(mockListings)
        setWishlist(mockWishlist)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading profile...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          User not found
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="container">
          <div className="row">
            <div className="col-md-3">
              <div className="profile-image">
                <img
                  src={user.profileImage || "https://via.placeholder.com/150"}
                  alt={user.name}
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "https://via.placeholder.com/150"
                  }}
                />
              </div>
            </div>
            <div className="col-md-9">
              <div className="profile-info">
                <h2>{user.name}</h2>
                <div className="profile-details">
                  <div className="profile-detail">
                    <FaEnvelope />
                    <span>{user.email}</span>
                  </div>
                  <div className="profile-detail">
                    <FaPhone />
                    <span>{user.phone}</span>
                  </div>
                  <div className="profile-detail">
                    <FaMapMarkerAlt />
                    <span>{user.location}</span>
                  </div>
                  <div className="profile-detail">
                    <FaCalendarAlt />
                    <span>Joined {new Date(user.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="profile-bio">{user.bio}</p>
                {isCurrentUser && (
                  <button className="btn btn-primary edit-profile-btn">
                    <FaEdit /> Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="container">
          <div className="profile-tabs">
            <button
              className={`profile-tab ${activeTab === "listings" ? "active" : ""}`}
              onClick={() => setActiveTab("listings")}
            >
              <FaShoppingBag /> Listings
            </button>
            {isCurrentUser && (
              <>
                <button
                  className={`profile-tab ${activeTab === "wishlist" ? "active" : ""}`}
                  onClick={() => setActiveTab("wishlist")}
                >
                  <FaHeart /> Wishlist
                </button>
                <button
                  className={`profile-tab ${activeTab === "messages" ? "active" : ""}`}
                  onClick={() => setActiveTab("messages")}
                >
                  <FaComments /> Messages
                </button>
              </>
            )}
          </div>

          <div className="profile-tab-content">
            {activeTab === "listings" && (
              <div className="listings-tab">
                <h3>My Listings</h3>
                {listings.length > 0 ? (
                  <div className="row">
                    {listings.map((listing) => (
                      <div key={listing._id} className="col-md-4 mb-4">
                        <div className="card h-100">
                          <div className="card-img-top-container">
                            <img
                              src={`https://via.placeholder.com/300x200?text=${listing.title}`}
                              className="card-img-top"
                              alt={listing.title}
                              style={{ height: "200px", objectFit: "cover" }}
                            />
                          </div>
                          <div className="card-body">
                            <h5 className="card-title">{listing.title}</h5>
                            <p className="card-text text-primary fw-bold">₹{listing.price}</p>
                            <p className="card-text text-muted">{listing.category}</p>
                            <p className="card-text text-muted">
                              <small>Listed on {new Date(listing.createdAt).toLocaleDateString()}</small>
                            </p>
                            <Link to={`/product/${listing._id}`} className="btn btn-primary">
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-items-message">
                    <p>No listings found</p>
                    {isCurrentUser && (
                      <Link to="/sell" className="btn btn-primary">
                        List an Item
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "wishlist" && isCurrentUser && (
              <div className="wishlist-tab">
                <h3>My Wishlist</h3>
                {wishlist.length > 0 ? (
                  <div className="row">
                    {wishlist.map((item) => (
                      <div key={item._id} className="col-md-4 mb-4">
                        <div className="card h-100">
                          <div className="card-img-top-container">
                            <img
                              src={`https://via.placeholder.com/300x200?text=${item.title}`}
                              className="card-img-top"
                              alt={item.title}
                              style={{ height: "200px", objectFit: "cover" }}
                            />
                          </div>
                          <div className="card-body">
                            <h5 className="card-title">{item.title}</h5>
                            <p className="card-text text-primary fw-bold">₹{item.price}</p>
                            <p className="card-text text-muted">{item.category}</p>
                            <div className="d-flex justify-content-between">
                              <Link to={`/product/${item._id}`} className="btn btn-primary">
                                View Details
                              </Link>
                              <button className="btn btn-outline-danger">Remove</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-items-message">
                    <p>Your wishlist is empty</p>
                    <Link to="/products" className="btn btn-primary">
                      Browse Products
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === "messages" && isCurrentUser && (
              <div className="messages-tab">
                <h3>My Messages</h3>
                <div className="no-items-message">
                  <p>No messages yet</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage

