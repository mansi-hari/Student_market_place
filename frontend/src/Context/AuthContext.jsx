import { createContext, useState, useEffect, useContext } from "react"
import { getCurrentUser, login, logout, signup } from "../utils/auth.service"


const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null) // Changed from user to currentUser
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Function to set user and update localStorage
  const setUserAndLocalStorage = (userData) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("token", userData.token || userData.data?.token) // Handle both response structures
    } else {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    }
    setCurrentUser(userData)
  }

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        const token = localStorage.getItem("token")

        if (storedUser && token) {
          // Verify token is still valid
          const { data } = await getCurrentUser()
          setUserAndLocalStorage(data) // Update user state and localStorage
        }
      } catch (err) {
        console.error("Auth error:", err)
        setUserAndLocalStorage(null) // Clear user state and localStorage on error
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const loginUser = async (credentials) => {
    try {
      setError(null)
      const response = await login(credentials)
      // Handle both response structures (data.user or data.data.user)
      const userData = response.data.user || response.data.data?.user;
      setUserAndLocalStorage(userData)
      return response.data
    } catch (err) {
      setError(err.response?.data?.error || "Login failed")
      throw err
    }
  }

  const signupUser = async (userData) => {
    try {
      setError(null)
      const { data } = await signup(userData)
      setUserAndLocalStorage(data.user) // Update user state and localStorage
      return data
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed")
      throw err
    }
  }

  const logoutUser = () => {
    logout()
    setUserAndLocalStorage(null) // Clear user state and localStorage
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser, // Changed from user to currentUser
        loading,
        error,
        login: loginUser,
        signup: signupUser,
        logout: logoutUser,
        isAuthenticated: !!currentUser, // Check if user is authenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

