import React, { createContext, useState, useEffect, useContext } from 'react';
import { getCurrentUser, login, logout, signup } from '../utils/auth.service';



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  


  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid
          const { data } = await getCurrentUser();
          setUser(data);
        }
      } catch (err) {
        console.error('Auth error:', err);
        logout();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const loginUser = async (credentials) => {
    try {
      setError(null);
      const { data } = await login(credentials);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      throw err;
    }
  };

  const signupUser = async (userData) => {
    try {
      setError(null);
      const { data } = await signup(userData);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      throw err;
    }
  };

  const logoutUser = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login: loginUser,
        signup: signupUser,
        logout: logoutUser,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);