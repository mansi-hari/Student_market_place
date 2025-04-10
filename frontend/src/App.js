import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect } from 'react';
import { initializeSocket } from './utils/socket';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './Context/AuthContext';
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
import Dashboard from './Pages/Dashboard';
import AdminPanel from './Pages/AdminPanel';
import Footer from './Components/Footer/Footer';
import ChatPage from './Pages/ChatPage';
import './App.css';
import ProfilePage from './Pages/ProfilePage';
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
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  console.log("Current User in AppContent (Path:", location.pathname, "):", currentUser);

  useEffect(() => {
    if (currentUser && location.pathname === '/auth/login') {
      // Fallback: If role is undefined, default to dashboard
      const userRole = currentUser.role || 'buyer';
      console.log("Redirecting to:", userRole === 'admin' ? '/admin' : '/dashboard');
      navigate(userRole === 'admin' ? '/admin' : '/dashboard');
    }
  }, [currentUser, location.pathname, navigate]);

  if (loading) return <div>Loading...</div>;

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
        
        <Route path="/sell" element={<ProtectedRoute><SellPage /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/dashboard"
          element={
            currentUser && (currentUser.role !== 'admin' || !currentUser.role)
              ? <Dashboard />
              : <Navigate to={currentUser?.role === 'admin' ? '/admin' : '/'} replace />
          }
        />
        <Route
          path="/admin"
          element={
            currentUser && currentUser.role === 'admin'
              ? <AdminPanel />
              : <Navigate to={currentUser ? '/dashboard' : '/auth/login'} replace />
          }
        />
        <Route path="/profile/:userId" element={<ProfilePage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;