import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { initializeSocket } from './utils/socket'; 
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './Context/AuthContext';
import { MarketplaceProvider } from './Context/MarketplaceContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Navbar from './Components/Navbar/Navbar';
import Hero from './Components/Hero/Hero';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import HomePage from './Pages/HomePage';
import Browse from './Pages/Browse';
import SellPage from './Pages/SellPage.jsx';
import WishlistPage from './Pages/WishlistPage.jsx';
import CategoryPage from './Pages/CategoryPage';
// import ProductDetail from './Pages/ProductDetail';
import ForgotPassword from './Pages/ForgotPassword';
import Dashboard from './Pages/Dashboard';
import './App.css';

import { useEffect } from 'react';

function App() {
  const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
  
  // Initialize socket connection only once
  useEffect(() => {
    if (token) {
      initializeSocket(token);
    }
  }, [token]);

  return (
    <AuthProvider>
      <MarketplaceProvider>
        <Router>
          <AppContent />
        </Router>
      </MarketplaceProvider>
    </AuthProvider>
  );
}

const AppContent = () => {
  const location = useLocation();

  return (
    <div>
      {/* Toaster for notifications */}
      <Toaster position="top-right" />

      {/* Navbar stays at the top */}
      <Navbar />

      {/* Hero Section only shown on HomePage */}
      {location.pathname === '/' && <Hero />}

      {/* Routing Section */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Browse />} />
        <Route path="/products/:category" element={<CategoryPage />} />
        {/* <Route path="/products/:category/:id" element={<ProductDetail />} /> */}

        {/* Auth Routes */}
        <Route path="/auth/login" element={<Login isSignup={false} />} />
        <Route path="/auth/signup" element={<Signup isSignup={true} />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          path="/sell"
          element={
            <ProtectedRoute>
              <SellPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        
        {/* Add the Dashboard route as a protected route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

    </div>
  );
};
export default App;
