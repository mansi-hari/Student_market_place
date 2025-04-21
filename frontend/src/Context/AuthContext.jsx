import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
const url = process.env.REACT_APP_API_URL;
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const setUserAndLocalStorage = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token || localStorage.getItem("token"));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    setCurrentUser(userData);
    console.log("Updated currentUser in state with role:", userData?.role);
  };

  const getCurrentUser = async (retryCount = 0, maxRetries = 3) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Attempting to fetch current user with token:", token);
      if (!token) {
        console.log("No token found in localStorage");
        return null;
      }

      const response = await axios.get(`${url}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data.data || response.data.user || response.data;
      const updatedUserData = { ...userData, token };
      console.log("API Response (getCurrentUser) with role:", updatedUserData);
      return userData;
    } catch (err) {
      console.error("Get current user error (attempt", retryCount + 1, "):", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
      if (retryCount < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return getCurrentUser(retryCount + 1, maxRetries);
      }
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        console.log("Falling back to stored user:", JSON.parse(storedUser));
        return JSON.parse(storedUser);
      }
      return null;
    }
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        console.log("Checking login - storedUser:", storedUser, "token:", token);

        if (storedUser && token) {
          const data = await getCurrentUser();
          console.log("Fetched user data with role:", data);
          setUserAndLocalStorage(data || JSON.parse(storedUser));
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
      const response = await axios.post(`${url}/api/auth/login`, credentials);
      console.log("Raw login response:", response.data);
      const userData = response.data.data?.user || response.data.user;
      const token = response.data.data?.token || response.data.token;
      if (!userData || !token) throw new Error("Invalid response from server");
      setUserAndLocalStorage({ ...userData, token });
      const freshUserData = await getCurrentUser();
      if (freshUserData) {
        setUserAndLocalStorage(freshUserData);
      }
      if (freshUserData?.role === "admin") {
        window.location.href = "/admin";
      } else if (freshUserData?.role === "buyer" || freshUserData?.role === "seller") {
        window.location.href = "/dashboard";
      }
      return response.data;
    } catch (err) {
      console.error("Login error details:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const signupUser = async (userData) => {
    try {
      setError(null);
      const response = await axios.post(`${url}/api/auth/register`, userData);
      const user = response.data.data?.user || response.data.user;
      setUserAndLocalStorage(user);
      const freshUserData = await getCurrentUser();
      if (freshUserData) {
        setUserAndLocalStorage(freshUserData);
      }
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      throw err;
    }
  };

  const logoutUser = () => {
    setUserAndLocalStorage(null);
    toast.success("Logged out successfully");
    console.log("Logout executed locally");
    window.location.href = "/auth/login";
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${url}/api/auth/dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Dashboard Data:", response.data);
      return response.data;
    } catch (err) {
      console.error("Dashboard fetch error:", err.response ? err.response.data : err.message);
      throw err;
    }
  };

  const registerIntent = async (productId) => {
    try {
      const response = await axios.post(
        `${url} /api/products/${productId}/intent`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      return response.data;
    } catch (err) {
      console.error("Intent registration error:", err);
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
        getCurrentUser,
        fetchDashboardData,
        registerIntent,
        token: currentUser?.token || localStorage.getItem("token"), 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);