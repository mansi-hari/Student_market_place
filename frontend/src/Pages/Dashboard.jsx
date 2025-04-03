import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { User, ShoppingBag, Tag, MessageCircle, Heart, LogOut } from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ orders: 0, listings: 0, wishlist: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to access dashboard");
      navigate("/auth/login");
      return;
    }

    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/user/dashboard", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        setUser(response.data.user);
        setStats({
          orders: response.data.orders,
          listings: response.data.listings,
          wishlist: response.data.wishlist,
        });
      }
    } catch (err) {
      toast.error("Failed to load dashboard: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/auth/login");
  };

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">User data not found. Please login again.</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <nav className="sidebar-nav">
          <a href="/dashboard/profile" className="nav-item">
            <User size={20} /> Profile
          </a>
          <a href="/dashboard/orders" className="nav-item">
            <ShoppingBag size={20} /> Orders
          </a>
          <a href="/dashboard/listings" className="nav-item">
            <Tag size={20} /> My Listings
          </a>
          <a href="/dashboard/wishlist" className="nav-item">
            <Heart size={20} /> Wishlist
          </a>
          <button onClick={handleLogout} className="nav-item logout-btn">
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>

      <main className="dashboard-content">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.profileImage ? (
              <img src={`http://localhost:5000/uploads/${user.profileImage}`} alt="User Avatar" />
            ) : (
              <div className="avatar-placeholder">No Avatar</div>
            )}
          </div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p className="email">{user.email}</p>
            <p className="university">University: {user.sellerUniversity}</p>
          </div>
        </div>

        <div className="stats-section">
          <h3>Your Stats</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <ShoppingBag size={24} />
              <h4>Orders</h4>
              <p>{stats.orders}</p>
            </div>
            <div className="stat-card">
              <Tag size={24} />
              <h4>Listings</h4>
              <p>{stats.listings}</p>
            </div>
            <div className="stat-card">
              <Heart size={24} />
              <h4>Wishlist</h4>
              <p>{stats.wishlist}</p>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <a href="/sell" className="btn btn-primary">List New Item</a>
            <a href="/products" className="btn btn-outline-primary">Browse Products</a>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;