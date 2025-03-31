import { useState, useEffect } from "react"
import axios from "axios"
import { Row, Col, Card } from "react-bootstrap"
import { FaUsers, FaShoppingBag, FaComments, FaExchangeAlt } from "react-icons/fa"
import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalMessages: 0,
    totalTransactions: 0,
  })
  const [recentUsers, setRecentUsers] = useState([])
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get("http://localhost:5000/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setStats(response.data.stats)
        setRecentUsers(response.data.recentUsers)
        setRecentProducts(response.data.recentProducts)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Sample data for charts
  const userGrowthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "New Users",
        data: [12, 19, 15, 25, 22, 30],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  }

  const productCategoryData = {
    labels: ["Books", "Electronics", "Furniture", "Supplies", "Transport", "Others"],
    datasets: [
      {
        label: "Products by Category",
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  }

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <h2 className="mb-4">Dashboard</h2>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Card className="admin-card text-center p-3">
            <div className="admin-card-icon text-primary">
              <FaUsers />
            </div>
            <Card.Title>Total Users</Card.Title>
            <Card.Text className="fs-2 fw-bold">{stats.totalUsers}</Card.Text>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="admin-card text-center p-3">
            <div className="admin-card-icon text-success">
              <FaShoppingBag />
            </div>
            <Card.Title>Total Products</Card.Title>
            <Card.Text className="fs-2 fw-bold">{stats.totalProducts}</Card.Text>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="admin-card text-center p-3">
            <div className="admin-card-icon text-info">
              <FaComments />
            </div>
            <Card.Title>Total Messages</Card.Title>
            <Card.Text className="fs-2 fw-bold">{stats.totalMessages}</Card.Text>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Card className="admin-card text-center p-3">
            <div className="admin-card-icon text-warning">
              <FaExchangeAlt />
            </div>
            <Card.Title>Transactions</Card.Title>
            <Card.Text className="fs-2 fw-bold">{stats.totalTransactions}</Card.Text>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header>User Growth</Card.Header>
            <Card.Body>
              <Line
                data={userGrowthData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Monthly User Registration",
                    },
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header>Products by Category</Card.Header>
            <Card.Body>
              <Bar
                data={productCategoryData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Product Distribution",
                    },
                  },
                }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>Recent Users</Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-hover admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>Recent Products</Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-hover admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Seller</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentProducts.map((product) => (
                      <tr key={product._id}>
                        <td>{product.title}</td>
                        <td>₹{product.price}</td>
                        <td>{product.seller?.name || "Unknown"}</td>
                        <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AdminDashboard

