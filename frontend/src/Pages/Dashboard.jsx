// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Dashboard = () => {
  const { currentUser, logout, fetchDashboardData } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    user: {},
    listings: 0,
    activeListings: 0,
    soldItems: 0,
    orders: 0,
    recentOrders: [],
    recentListings: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          setLoading(true);
          console.log("Fetching dashboard for user:", currentUser);
          const response = await fetchDashboardData();
          console.log("Dashboard response:", response);
          if (response.success) {
            setDashboardData(response.data);
          } else {
            toast.error(response.message || "Failed to load dashboard");
          }
        } catch (error) {
          console.error("Error fetching dashboard:", error);
          toast.error(error.response?.data?.message || "Failed to load dashboard");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, fetchDashboardData]);

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
              <p className="card-text">Name: {dashboardData.user.name}</p>
              <p className="card-text">Email: {dashboardData.user.email}</p>
              <p className="card-text">University: {dashboardData.user.sellerUniversity}</p>
              <Link to="/profile" className="btn btn-primary btn-sm">Edit Profile</Link>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Stats Overview</h5>
              <div className="row">
                <div className="col-6 col-md-4 mb-3">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h6>Total Listings</h6>
                      <p className="text-success">{dashboardData.listings}</p>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-4 mb-3">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h6>Active Listings</h6>
                      <p className="text-success">{dashboardData.activeListings}</p>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-4 mb-3">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h6>Sold Items</h6>
                      <p className="text-success">{dashboardData.soldItems}</p>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-4 mb-3">
                  <div className="card bg-light">
                    <div className="card-body text-center">
                      <h6>Orders</h6>
                      <p className="text-success">{dashboardData.orders}</p>
                    </div>
                  </div>
                </div>
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
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentListings.map((listing) => (
                      <tr key={listing._id}>
                        <td>{listing.title}</td>
                        <td>${listing.price}</td>
                        <td>{new Date(listing.createdAt).toLocaleDateString()}</td>
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
                        <td>{order.product?.title || 'N/A'}</td>
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

        <div className="col-12 text-center mt-4">
          <Link to="/sell" className="btn btn-success me-2">List New Item</Link>
          <button onClick={logout} className="btn btn-danger">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; // Ensure this line is present