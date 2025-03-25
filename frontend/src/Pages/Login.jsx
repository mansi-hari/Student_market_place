import { useState } from "react"
import axios from "axios"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { toast } from "react-hot-toast"
import { initializeSocket } from "../utils/socket"; // Adjust the path as needed


const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
  
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
  
      console.log("Login API Response:", response.data); 

      if (response.data.success) {
        const token = response.data.token;
        const user = response.data.user;
  
        if (!token || !user) {
          throw new Error("Invalid response structure");
        }
  
        // Store token and user
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
  
        // Initialize socket connection
        initializeSocket(token);
  
        toast.success("Login successful!");
        navigate("/sell");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:",  err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Login</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </button>

                <div className="mt-3 text-center">
                  <p>
                    Don't have an account?{" "}
                    <Link to="/auth/signup" className="text-decoration-none">Sign up</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
