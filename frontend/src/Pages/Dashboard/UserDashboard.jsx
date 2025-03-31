import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom"
import axios from "axios"
import { Row, Col, Card, Button, Tabs, Tab } from "react-bootstrap"
import { FaShoppingBag, FaHeart, FaComments, FaUser } from "react-icons/fa"
import { toast } from "react-hot-toast"
import "./Dashboard.css"

// Dashboard Components
import MyProducts from "./MyProducts"
import MyWishlist from "./MyWishlist"
import MyMessages from "./MyMessages"
import MyProfile from "./MyProfile"

const UserDashboard = () => {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    products: 0,
    wishlist: 0,
    messages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("products")
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setIsAuthenticated(false)
      setLoading(false)
      return
    }

    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      // Fetch user profile
      const userResponse = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setUser(userResponse.data)

      // Fetch user stats
      const statsResponse = await axios.get("http://localhost:5000/api/user/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setStats(statsResponse.data)
    } catch (error) {
      console.error("Error fetching user data:", error)
      if (error.response && error.response.status === 401) {
        setIsAuthenticated(false)
        localStorage.removeItem("token")
        toast.error("Session expired. Please login again.")
      } else {
        toast.error("Failed to load dashboard data")
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return (
    <div className="dashboard-container">
      <div className="container py-5">
        <Row className="mb-4">
          <Col md={8}>
            <h1 className="dashboard-title">My Dashboard</h1>
            <p className="text-muted">Welcome back, {user?.name}!</p>
          </Col>
          <Col md={4} className="text-md-end">
            <Button variant="outline-primary" href="/sell">
              <FaShoppingBag className="me-2" /> List New Item
            </Button>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={4} className="mb-3">
            <Card className="dashboard-card" onClick={() => setActiveTab("products")}>
              <Card.Body className="d-flex align-items-center">
                <div className="dashboard-card-icon bg-primary text-white">
                  <FaShoppingBag />
                </div>
                <div className="ms-3">
                  <h3 className="mb-0">{stats.products}</h3>
                  <p className="text-muted mb-0">My Products</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="dashboard-card" onClick={() => setActiveTab("wishlist")}>
              <Card.Body className="d-flex align-items-center">
                <div className="dashboard-card-icon bg-danger text-white">
                  <FaHeart />
                </div>
                <div className="ms-3">
                  <h3 className="mb-0">{stats.wishlist}</h3>
                  <p className="text-muted mb-0">Wishlist Items</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="dashboard-card" onClick={() => setActiveTab("messages")}>
              <Card.Body className="d-flex align-items-center">
                <div className="dashboard-card-icon bg-info text-white">
                  <FaComments />
                </div>
                <div className="ms-3">
                  <h3 className="mb-0">{stats.messages}</h3>
                  <p className="text-muted mb-0">Messages</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Dashboard Tabs */}
        <Card className="dashboard-content">
          <Card.Body>
            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4 dashboard-tabs">
              <Tab
                eventKey="products"
                title={
                  <>
                    <FaShoppingBag className="me-2" /> My Products
                  </>
                }
              >
                <MyProducts refreshStats={fetchUserData} />
              </Tab>
              <Tab
                eventKey="wishlist"
                title={
                  <>
                    <FaHeart className="me-2" /> My Wishlist
                  </>
                }
              >
                <MyWishlist refreshStats={fetchUserData} />
              </Tab>
              <Tab
                eventKey="messages"
                title={
                  <>
                    <FaComments className="me-2" /> Messages
                  </>
                }
              >
                <MyMessages />
              </Tab>
              <Tab
                eventKey="profile"
                title={
                  <>
                    <FaUser className="me-2" /> My Profile
                  </>
                }
              >
                <MyProfile user={user} setUser={setUser} />
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default UserDashboard

