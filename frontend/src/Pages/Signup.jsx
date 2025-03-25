// Pages/Signup.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

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

    // Validation
    if (!name || !email || !password || !university || !location.formatted || !location.pinCode) {
      setErrorMessage("All fields are required.");
      return;
    }

    const userData = {
      name,
      email,
      password,
      university,
      location: {
        formatted: location.formatted,
        pinCode: location.pinCode,
      },
    };

    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, userData);
      localStorage.setItem("token", response.data.token); // Save the token in localStorage
      setSuccessMessage("Successfully signed up!");
      setTimeout(() => {
        navigate("/"); // Redirect after 2 seconds
      }, 2000);
    } catch (error) {
      console.error("Signup error: ", error.response ? error.response.data : error);
      setErrorMessage(error.response ? error.response.data.message : "An unexpected error occurred!");
    }
  };

  return (
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
        />
      </div>

      <button type="submit" className="btn btn-primary">Signup</button>
    </form>
  );
};

export default Signup;