import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-hot-toast";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [dashboardStats, setDashboardStats] = useState({});
  const [products, setProducts] = useState([]);
  const [pendingIntents, setPendingIntents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    console.log("Current User in Dashboard:", currentUser);
    console.log(url)
    if (!currentUser) {
      window.location.href = "/auth/login";
      return;
    }
    if (currentUser.role !== "admin") {
      console.log("Not an admin, redirecting to appropriate dashboard. Role:", currentUser.role);
      if (currentUser.role === "buyer") window.location.href = "/buyer-dashboard";
      else if (currentUser.role === "seller") window.location.href = "/seller-dashboard";
      else window.location.href = "/auth/login";
      return;
    }

    fetchDashboardStats();
    fetchProducts();
    fetchPendingIntents();
    fetchUsers();
  }, [currentUser]);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Dashboard Stats Response (Raw):", response.data);
      if (response.data && typeof response.data === "object") {
        setDashboardStats(response.data);
      } else {
        setDashboardStats({ totalProducts: 0, totalUsers: 0, pendingIntents: 0 });
        console.warn("Unexpected response format:", response.data);
      }
    } catch (error) {
      setError(
        `Failed to load dashboard stats: ${error.response?.data?.message || error.message}`
      );
      toast.error(
        `Failed to load dashboard stats: ${error.response?.data?.message || error.message}`
      );
      console.error("Dashboard stats error:", error.response ? error.response.data : error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/products`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Products Response:", response.data);
      setProducts(response.data.data || []);
    } catch (error) {
      setError(`Failed to load products: ${error.response?.data?.message || error.message}`);
      toast.error(`Failed to load products: ${error.response?.data?.message || error.message}`);
      console.error("Products error:", error.response ? error.response.data : error.message);
    }
  };

  const fetchPendingIntents = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/pending-intents`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Pending Intents Response:", response.data);
      setPendingIntents(response.data.data || []);
    } catch (error) {
      setError(
        `Failed to load pending intents: ${error.response?.data?.message || error.message}`
      );
      toast.error(
        `Failed to load pending intents: ${error.response?.data?.message || error.message}`
      );
      console.error("Pending intents error:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Users Response:", response.data);
      setUsers(response.data || []);
    } catch (error) {
      setError(`Failed to load users: ${error.response?.data?.message || error.message}`);
      toast.error(`Failed to load users: ${error.response?.data?.message || error.message}`);
      console.error("Users error:", error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`${url}/api/admin/products/${productId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProducts(products.filter((p) => p._id !== productId));
        toast.success("Product deleted successfully");
      } catch (error) {
        toast.error("Failed to delete product");
        console.error("Delete error:", error.response ? error.response.data : error.message);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${url}/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsers(users.filter((u) => u._id !== userId));
        toast.success("User deleted successfully");
      } catch (error) {
        toast.error("Failed to delete user");
        console.error("Delete user error:", error.response ? error.response.data : error.message);
      }
    }
  };

  const handleApproveSale = async (productId) => {
    if (window.confirm("Are you sure you want to approve this sale?")) {
      try {
        await axios.post(
          `${url}/api/products/${productId}/approve-sale`,
          {},
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setPendingIntents(pendingIntents.filter((p) => p._id !== productId));
        toast.success("Sale approved successfully");
      } catch (error) {
        toast.error("Failed to approve sale");
        console.error("Approve sale error:", error.response ? error.response.data : error.message);
      }
    }
  };

  if (loading) return <div className="container text-center my-5">Loading...</div>;
  if (error) return <div className="container my-5 alert alert-danger">{error}</div>;

  return (
    <div className="admin-dashboard container mt-5">
      <h2>Admin Dashboard</h2>

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5>Total Products</h5>
              <p>{dashboardStats.totalProducts || 0}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5>Total Users</h5>
              <p>{dashboardStats.totalUsers || 0}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <h5>Pending Intents</h5>
              <p>{dashboardStats.pendingIntents || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <h3>Products</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.title}</td>
              <td>₹{product.price}</td>
              <td>{product.isSold ? "Sold" : "Available"}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Users</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
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
                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => handleDeleteUser(user._id)}
                  disabled={user._id === currentUser._id}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Pending Intents</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Seller</th>
            <th>Buyer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingIntents.map((intent) => (
            <tr key={intent._id}>
              <td>{intent.title}</td>
              <td>{intent.seller?.name || "N/A"} ({intent.seller?.email || "N/A"})</td>
              <td>{intent.intentBy?.name || "N/A"} ({intent.intentBy?.email || "N/A"})</td>
              <td>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleApproveSale(intent._id)}
                >
                  Approve Sale
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;