import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import './Dashboard.css'; 

const Dashboard = () => {
  const { currentUser, logout, fetchDashboardData } = useAuth() || {};
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    user: {},
    listings: 0,
    activeListings: 0,
    soldItems: 0,
    orders: 0,
    recentOrders: [],
    recentListings: [],
    purchasedItems: [],
    activeInterests: [],
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    console.log("Current User in Dashboard:", currentUser);
    if (!currentUser) {
      navigate("/auth/login");
      return;
    }
    if (currentUser.role === "admin") {
      console.log("Admin detected, redirecting to admin dashboard.");
      navigate("/admin");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchDashboardData();
        if (response?.success) {
          setDashboardData(response.data || {});
        } else {
          toast.error(response?.message || "Failed to load dashboard");
        }
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        toast.error(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser, fetchDashboardData, navigate]);

  const handleMarkAsSold = (productId) => {
    setSelectedProductId(productId);
    setShowModal(true);
    setErrorMessage("");
  };

  const confirmSale = async () => {
    if (!buyerEmail) {
      setErrorMessage("Buyer email is required");
      return;
    }
    setErrorMessage(""); // Clear previous errors
    try {
      const response = await axios.put(
        `http://localhost:5000/api/products/${selectedProductId}/sold`,
        { buyerEmail },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Item marked as sold!");
        setDashboardData((prev) => ({
          ...prev,
          recentListings: prev.recentListings.filter((item) => item._id !== selectedProductId),
          soldItems: prev.soldItems + 1,
        }));
        setShowModal(false);
      } else {
        setErrorMessage(response.data.message || "Failed to mark as sold");
      }
    } catch (error) {
      console.error("Sale error:", error);
      setErrorMessage(error.response?.data?.message || "Server error, please try again later");
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (!currentUser) return (
    <div className="text-center py-5">
      Please <Link to="/auth/login" className="text-primary">login</Link> to access your dashboard.
    </div>
  );

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">My Dashboard</h1>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title">Profile</h5>
              <p className="card-text">Name: {dashboardData.user.name || "N/A"}</p>
              <p className="card-text">Email: {dashboardData.user.email || "N/A"}</p>
              <p className="text-center">University: {dashboardData.user.sellerUniversity || "N/A"}</p>
              <Link to="/profile" className="btn btn-primary btn-sm">Edit Profile</Link>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Stats Overview</h5>
              <div className="row">
                {dashboardData.listings > 0 && (
                  <div className="col-6 col-md-4 mb-3">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h6>Total Listings</h6>
                        <p className="text-success">{dashboardData.listings}</p>
                      </div>
                    </div>
                  </div>
                )}
                {dashboardData.activeListings > 0 && (
                  <div className="col-6 col-md-4 mb-3">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h6>Active Listings</h6>
                        <p className="text-success">{dashboardData.activeListings}</p>
                      </div>
                    </div>
                  </div>
                )}
                {dashboardData.soldItems > 0 && (
                  <div className="col-6 col-md-4 mb-3">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h6>Sold Items</h6>
                        <p className="text-success">{dashboardData.soldItems}</p>
                      </div>
                    </div>
                  </div>
                )}
                {dashboardData.orders > 0 && (
                  <div className="col-6 col-md-4 mb-3">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h6>Orders</h6>
                        <p className="text-success">{dashboardData.orders}</p>
                      </div>
                    </div>
                  </div>
                )}
                {dashboardData.purchasedItems.length > 0 && (
                  <div className="col-6 col-md-4 mb-3">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h6>Purchased Items</h6>
                        <p className="text-success">{dashboardData.purchasedItems.length}</p>
                      </div>
                    </div>
                  </div>
                )}
                {dashboardData.activeInterests.length > 0 && (
                  <div className="col-6 col-md-4 mb-3">
                    <div className="card bg-light">
                      <div className="card-body text-center">
                        <h6>Active Interests</h6>
                        <p className="text-success">{dashboardData.activeInterests.length}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Recent Listings</h5>
              {dashboardData.recentListings.length > 0 ? (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Price</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentListings.map((listing) => (
                      <tr key={listing._id}>
                        <td>{listing.title}</td>
                        <td>${listing.price}</td>
                        <td>{new Date(listing.createdAt).toLocaleDateString()}</td>
                        {!listing.isSold && <td><button onClick={() => handleMarkAsSold(listing._id)} className="btn btn-dark">Mark as Sold</button></td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="text-center">No recent listings</p>}
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Recent Orders</h5>
              {dashboardData.recentOrders.length > 0 ? (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id.slice(-6)}</td>
                        <td>{order.product?.title || "N/A"}</td>
                        <td>${order.price}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="text-center">No recent orders</p>}
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Purchased Items</h5>
              {dashboardData.purchasedItems.length > 0 ? (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Seller</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.purchasedItems.map((item) => (
                      <tr key={item._id}>
                        <td>{item.title}</td>
                        <td>{item.seller.name}</td>
                        <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="text-center">No purchased items</p>}
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Active Interests</h5>
              {dashboardData.activeInterests.length > 0 ? (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Seller</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.activeInterests.map((item) => (
                      <tr key={item._id}>
                        <td>{item.title}</td>
                        <td>{item.seller.name}</td>
                        <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="text-center">No active interests</p>}
            </div>
          </div>
        </div>
        <div className="col-12 text-center mt-4">
          <Link to="/sell" className="btn btn-success me-2">List New Item</Link>
          <button onClick={logout} className="btn btn-danger">Logout</button>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="confirm-sale-modal">
            <h3>Confirm Sale</h3>
            <div className="form-group">
              <label htmlFor="buyerEmail">Buyer Email</label>
              <input
                type="email"
                id="buyerEmail"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                placeholder="Enter buyer email"
              />
              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
            <div className="modal-actions">
              <button onClick={confirmSale} className="btn btn-primary">Confirm Sale</button>
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;