import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaUsers,
  FaShoppingBag,
  FaChartLine,
  FaComments,
  FaExclamationTriangle,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
} from "react-icons/fa"
import "./AdminPanel.css"

const AdminPanel = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    activeListings: 0,
    pendingReports: 0,
  })

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.isAdmin) {
      navigate("/")
      return
    }

    fetchDashboardData()
  }, [navigate])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // In a real app, you would fetch this data from your API
      // For demo purposes, we'll use mock data

      // Mock products data
      const mockProducts = [
        {
          _id: "1",
          title: "HP Laptop",
          category: "Electronics",
          price: 25000,
          status: "active",
          createdAt: "2023-05-15T10:30:00Z",
        },
        {
          _id: "2",
          title: "Study Table",
          category: "Furniture",
          price: 1500,
          status: "active",
          createdAt: "2023-05-14T09:20:00Z",
        },
        {
          _id: "3",
          title: "Physics Textbook",
          category: "Books",
          price: 350,
          status: "active",
          createdAt: "2023-05-13T14:45:00Z",
        },
        {
          _id: "4",
          title: "Bicycle",
          category: "Transport",
          price: 3000,
          status: "inactive",
          createdAt: "2023-05-12T11:10:00Z",
        },
        {
          _id: "5",
          title: "Scientific Calculator",
          category: "Electronics",
          price: 800,
          status: "active",
          createdAt: "2023-05-11T16:30:00Z",
        },
      ]

      // Mock users data
      const mockUsers = [
        {
          _id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "user",
          status: "active",
          createdAt: "2023-04-10T08:30:00Z",
        },
        {
          _id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "user",
          status: "active",
          createdAt: "2023-04-12T10:15:00Z",
        },
        {
          _id: "3",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          status: "active",
          createdAt: "2023-04-05T09:00:00Z",
        },
        {
          _id: "4",
          name: "Sam Wilson",
          email: "sam@example.com",
          role: "user",
          status: "inactive",
          createdAt: "2023-04-15T14:20:00Z",
        },
        {
          _id: "5",
          name: "Alex Johnson",
          email: "alex@example.com",
          role: "user",
          status: "active",
          createdAt: "2023-04-18T11:45:00Z",
        },
      ]

      // Mock reports data
      const mockReports = [
        {
          _id: "1",
          type: "product",
          itemId: "1",
          reason: "Inappropriate content",
          status: "pending",
          createdAt: "2023-05-16T13:20:00Z",
        },
        { _id: "2", type: "user", itemId: "4", reason: "Spam", status: "resolved", createdAt: "2023-05-15T09:10:00Z" },
        {
          _id: "3",
          type: "product",
          itemId: "3",
          reason: "Misleading information",
          status: "pending",
          createdAt: "2023-05-14T16:45:00Z",
        },
      ]

      setProducts(mockProducts)
      setUsers(mockUsers)
      setReports(mockReports)

      // Set dashboard stats
      setStats({
        totalUsers: mockUsers.length,
        totalProducts: mockProducts.length,
        activeListings: mockProducts.filter((p) => p.status === "active").length,
        pendingReports: mockReports.filter((r) => r.status === "pending").length,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = (productId) => {
    // In a real app, you would call your API to delete the product
    setProducts(products.filter((product) => product._id !== productId))
  }

  const handleToggleUserStatus = (userId) => {
    // In a real app, you would call your API to update the user status
    setUsers(
      users.map((user) => {
        if (user._id === userId) {
          return { ...user, status: user.status === "active" ? "inactive" : "active" }
        }
        return user
      }),
    )
  }

  const handleResolveReport = (reportId) => {
    // In a real app, you would call your API to resolve the report
    setReports(
      reports.map((report) => {
        if (report._id === reportId) {
          return { ...report, status: "resolved" }
        }
        return report
      }),
    )
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading admin panel...</p>
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <ul className="admin-sidebar-menu">
          <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
            <FaChartLine /> Dashboard
          </li>
          <li className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>
            <FaShoppingBag /> Products
          </li>
          <li className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
            <FaUsers /> Users
          </li>
          <li className={activeTab === "reports" ? "active" : ""} onClick={() => setActiveTab("reports")}>
            <FaExclamationTriangle /> Reports
          </li>
          <li className={activeTab === "messages" ? "active" : ""} onClick={() => setActiveTab("messages")}>
            <FaComments /> Messages
          </li>
        </ul>
      </div>

      <div className="admin-content">
        {activeTab === "dashboard" && (
          <div className="admin-dashboard">
            <h2>Dashboard</h2>
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon users">
                  <FaUsers />
                </div>
                <div className="stat-details">
                  <h3>Total Users</h3>
                  <p>{stats.totalUsers}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon products">
                  <FaShoppingBag />
                </div>
                <div className="stat-details">
                  <h3>Total Products</h3>
                  <p>{stats.totalProducts}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon listings">
                  <FaCheck />
                </div>
                <div className="stat-details">
                  <h3>Active Listings</h3>
                  <p>{stats.activeListings}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon reports">
                  <FaExclamationTriangle />
                </div>
                <div className="stat-details">
                  <h3>Pending Reports</h3>
                  <p>{stats.pendingReports}</p>
                </div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">
                    <FaShoppingBag />
                  </div>
                  <div className="activity-details">
                    <p>
                      New product listed: <strong>HP Laptop</strong>
                    </p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">
                    <FaUsers />
                  </div>
                  <div className="activity-details">
                    <p>
                      New user registered: <strong>Jane Smith</strong>
                    </p>
                    <span className="activity-time">5 hours ago</span>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">
                    <FaExclamationTriangle />
                  </div>
                  <div className="activity-details">
                    <p>
                      New report submitted: <strong>Inappropriate content</strong>
                    </p>
                    <span className="activity-time">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="admin-products">
            <h2>Products Management</h2>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Date Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>{product.title}</td>
                      <td>{product.category}</td>
                      <td>₹{product.price}</td>
                      <td>
                        <span className={`status-badge ${product.status}`}>{product.status}</span>
                      </td>
                      <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-primary me-2">
                          <FaEdit /> Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(product._id)}>
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="admin-users">
            <h2>Users Management</h2>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Date Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <span className={`status-badge ${user.status}`}>{user.status}</span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-primary me-2">
                          <FaEdit /> Edit
                        </button>
                        <button className="btn btn-sm btn-warning" onClick={() => handleToggleUserStatus(user._id)}>
                          {user.status === "active" ? <FaTimes /> : <FaCheck />}
                          {user.status === "active" ? " Deactivate" : " Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="admin-reports">
            <h2>Reports Management</h2>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Date Reported</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report._id}>
                      <td>{report.type}</td>
                      <td>{report.reason}</td>
                      <td>
                        <span className={`status-badge ${report.status}`}>{report.status}</span>
                      </td>
                      <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleResolveReport(report._id)}
                          disabled={report.status === "resolved"}
                        >
                          <FaCheck /> {report.status === "resolved" ? "Resolved" : "Resolve"}
                        </button>
                        <button className="btn btn-sm btn-primary">
                          <FaEdit /> View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="admin-messages">
            <h2>Messages</h2>
            <p>This feature is coming soon.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel

