
import React, { useEffect, useState } from 'react';
import axios from '../axios';  // Import Axios instance
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);  // Store the user data
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);  // Track error state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/users/me'); // Replace with your API route to fetch user data
        setUserData(response.data);
      } catch (err) {
        setError('Failed to load user data');
        navigate('/login'); // Redirect to login if the user is not authenticated
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return <div className="spinner-border" role="status"><span className="sr-only">Loading...</span></div>;  // Show a loading spinner while fetching data
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;  // Show error if fetching data fails
  }

  return (
    <div className="container mt-5">
      <h2>Welcome, {userData?.name}</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">User Information</h5>
          <p className="card-text"><strong>Email:</strong> {userData?.email}</p>
          <p className="card-text"><strong>Role:</strong> {userData?.isAdmin ? 'Admin' : 'User'}</p>
          <p className="card-text"><strong>Joined:</strong> {new Date(userData?.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
