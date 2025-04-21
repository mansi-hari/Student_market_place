import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast"; 
import "./Signup.css";

const url = process.env.REACT_APP_API_URL;
const API_URL = process.env.REACT_APP_API_URL || `${url}`;

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [location, setLocation] = useState({
    formatted: "",
    pinCode: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocation((prevLocation) => ({
      ...prevLocation,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !university || !location.formatted || !location.pinCode) {
      setErrorMessage("All fields are required.");
      toast.error("All fields are required.", { position: "top-center" });
      return;
    }

    const userData = {
      name,
      email,
      password,
      sellerUniversity: university, 
      location: {
        formatted: location.formatted,
        pinCode: location.pinCode,
      },
    };

    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, userData);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token); 
        setSuccessMessage("Successfully signed up!");
        toast.success("Successfully signed up!", { position: "top-center" });
        setTimeout(() => {
          navigate("/"); 
        }, 2000);
      }
    } catch (error) {
      console.error("Signup error: ", error.response ? error.response.data : error);
      const errorMsg = error.response ? error.response.data.message : "An unexpected error occurred!";
      setErrorMessage(errorMsg);
      if (errorMsg.includes("Mohan Nagar")) {
        toast.error(errorMsg, {
          duration: 5000, 
          position: "top-center",
        });
      } else {
        toast.error(errorMsg, { position: "top-center" });
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            id="name"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="university" className="form-label">University</label>
          <input
            type="text"
            id="university"
            className="form-control"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            placeholder="Enter your university name"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="locationFormatted" className="form-label">Location</label>
          <input
            type="text"
            id="locationFormatted"
            className="form-control"
            name="formatted"
            value={location.formatted}
            onChange={handleLocationChange}
            placeholder="Enter your location (e.g., Mohan Nagar, Ghaziabad)"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="pinCode" className="form-label">Pin Code</label>
          <input
            type="text"
            id="pinCode"
            className="form-control"
            name="pinCode"
            value={location.pinCode}
            onChange={handleLocationChange}
            placeholder="Enter PIN code (e.g., 201007)"
            required
          />
          <small className="form-text text-muted">
            Note: This service is only available for Mohan Nagar, Ghaziabad (PIN: 201007).
          </small>
        </div>

        <button type="submit" className="btn btn-primary w-100">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;