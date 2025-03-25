import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
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
import SellPage from './Pages/SellPage';
import WishlistPage from './Pages/WishlistPage';
import CategoryPage from './Pages/CategoryPage';
import ProductDetail from './Pages/ProductDetail';
import ForgotPassword from './Pages/ForgotPassword';
import Dashboard from './Pages/Dashboard';
import Footer from './Components/Footer/Footer';
import ChatPage from './Pages/ChatPage';  // Import Chat Page
import './App.css';

function App() {
  const token = localStorage.getItem('token'); // Get token from localStorage
  
  // Initialize socket connection if user is logged in
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
  if (!location) return null;

  return (
    <div>
      {/* Toaster for notifications */}
      <Toaster position="top-right" />

      {/* Navbar remains fixed at the top */}
      <Navbar />

      {/* Hero Section only appears on the HomePage */}
      {location.pathname === '/' && <Hero />}

      {/* Routing Section */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Browse />} />
        <Route path="/browse/:category" element={<Browse />} />
        <Route path="/products/:category" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />  {/* Fixed Route for Product Details */}
        
        {/* Chat Page Route */}
        <Route path="/chat/:sellerId" element={<ChatPage />} />

        {/* Auth Routes */}
        <Route path="/auth/login" element={<Login isSignup={false} />} />
        <Route path="/auth/signup" element={<Signup isSignup={true} />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />

        
        <Route path="/sell" element={<ProtectedRoute><SellPage /></ProtectedRoute>} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      {/* Footer remains at the bottom */}
      <Footer />
    </div>
  );
};

export default App;
