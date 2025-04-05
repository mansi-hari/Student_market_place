import { createContext, useState, useEffect, useContext } from "react";
import {
  getCurrentUser,
  login,
  logout,
  signup,
  getUserDashboard,
} from "../utils/auth.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setUserAndLocalStorage = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token || userData.data?.token || localStorage.getItem("token"));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    setCurrentUser(userData);
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        console.log("Checking login - storedUser:", storedUser, "token:", token);

        if (storedUser && token) {
          const data  = await getCurrentUser();
          console.log("Fetched user data:", data);
          if (data) {
            setUserAndLocalStorage(data);
          } else {
            setUserAndLocalStorage(JSON.parse(storedUser)); // Fallback
          }
        } else {
          setUserAndLocalStorage(null);
        }
      } catch (err) {
        console.error("Auth error during check:", err);
        setUserAndLocalStorage(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const loginUser = async (credentials) => {
    try {
      setError(null);
      const response = await login(credentials);
      const userData = response.data.user || response.data.data?.user;
      setUserAndLocalStorage(userData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      throw err;
    }
  };

  const signupUser = async (userData) => {
    try {
      setError(null);
      const { data } = await signup(userData);
      setUserAndLocalStorage(data.user);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      throw err;
    }
  };

  const logoutUser = () => {
    logout();
    setUserAndLocalStorage(null);
  };

  const fetchDashboardData = async () => {
    try {
      const response = await getUserDashboard();
      console.log("Dashboard data:", response);
      return response;
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        login: loginUser,
        signup: signupUser,
        logout: logoutUser,
        isAuthenticated: !!currentUser,
        fetchDashboardData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);