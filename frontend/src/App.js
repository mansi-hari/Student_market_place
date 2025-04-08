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
import ProductPage from './Pages/ProductPage'; 
import WishlistPage from './Pages/WishlistPage';
import CategoryPage from './Pages/CategoryPage';
import ProductDetail from './Pages/ProductDetail';
import ForgotPassword from './Pages/ForgotPassword';
import Dashboard from './Pages/Dashboard'; 
import BuyerDashboard from './Pages/BuyerDashboard';
import Footer from './Components/Footer/Footer';
import ChatPage from './Pages/ChatPage';
import './App.css';
import AdminPanel from './Pages/AdminPanel';
import ProfilePage from "./Pages/ProfilePage"
import Cart from './Pages/Cart';


function App() {
  const token = localStorage.getItem('token');

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
      <Toaster position="top-right" />
      <Navbar />
      {location.pathname === '/' && <Hero />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Browse />} />
        <Route path="/browse/:category" element={<Browse />} />
        <Route path="/products/category/:categoryName" element={<CategoryPage />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/chat/:sellerId" element={<ChatPage />} />
        <Route path="/auth/login" element={<Login isSignup={false} />} />
        <Route path="/auth/signup" element={<Signup isSignup={true} />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/sell" element={<ProtectedRoute><SellPage /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<Dashboard />} /> 
        <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<AdminPanel />} />
     
        <Route path="/profile/:userId" element={<ProfilePage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;