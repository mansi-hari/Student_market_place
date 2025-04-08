// src/components/BuyerDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const BuyerDashboard = () => {
  const { fetchBuyerDashboard, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState({ purchasedItems: [], activeInterests: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const response = await fetchBuyerDashboard();
        if (response.success) setDashboardData(response.data);
        else toast.error(response.message || "Failed to load dashboard");
      } catch (error) {
        console.error("Buyer dashboard error:", error);
        toast.error(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [fetchBuyerDashboard]);

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Buyer Dashboard</h1>
      <div className="row g-4">
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
                      <th>Price</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.purchasedItems.map((item) => (
                      <tr key={item._id}>
                        <td>{item.title}</td>
                        <td>{item.seller.name} ({item.seller.email})</td>
                        <td>${item.price}</td>
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
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.activeInterests.map((item) => (
                      <tr key={item._id}>
                        <td>{item.title}</td>
                        <td>{item.seller.name} ({item.seller.email})</td>
                        <td>${item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p className="text-center">No active interests</p>}
            </div>
          </div>
        </div>
        <div className="col-12 text-center mt-4">
          <Link to="/" className="btn btn-primary">Browse Items</Link>
          <button onClick={logout} className="btn btn-danger ms-2">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;