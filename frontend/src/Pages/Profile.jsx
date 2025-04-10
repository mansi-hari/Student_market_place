import React, { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const Profile = ({ userId: propUserId }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    sellerUniversity: "",
    bio: "",
    phone: "",
    profileImage: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth/login");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        console.log("Fetching profile with token:", localStorage.getItem("token"));
        const response = await axios.get(`http://localhost:5000/api/auth/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const userData = response.data.user || response.data;
        console.log("Fetched user profile data:", userData);
        setProfileData({
          name: userData.name || "",
          email: userData.email || "",
          sellerUniversity: userData.sellerUniversity || "",
          bio: userData.bio || "",
          phone: userData.phone || "",
          profileImage: userData.profileImage || "", // This will now be the full URL
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile data");
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    const effectiveUserId = propUserId || userId || currentUser._id;
    if (effectiveUserId && effectiveUserId !== currentUser._id) {
      console.log("Fetching profile for userId:", effectiveUserId);
      // Add logic to fetch other user's profile if backend supports it
    } else {
      fetchUserProfile();
    }
  }, [currentUser, navigate, propUserId, userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileData((prev) => ({ ...prev, profileImage: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser || (propUserId && propUserId !== currentUser._id) || (userId && userId !== currentUser._id)) {
      toast.error("You can only edit your own profile");
      return;
    }
    try {
      setLoading(true);
      console.log("Updating profile with token:", localStorage.getItem("token"));
      console.log("Form data being sent:", { ...profileData, profileImage: profileData.profileImage ? "File" : "No file" });
      const formData = new FormData();
      formData.append("name", profileData.name);
      formData.append("university", profileData.sellerUniversity);
      formData.append("bio", profileData.bio);
      formData.append("phone", profileData.phone);
      if (profileData.profileImage && typeof profileData.profileImage !== "string") {
        formData.append("profileImage", profileData.profileImage);
      }

      const response = await axios.put(
        "http://localhost:5000/api/auth/me",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        const freshData = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const updatedUser = freshData.data.user || freshData.data;
        setProfileData({
          name: updatedUser.name || "",
          email: updatedUser.email || "",
          sellerUniversity: updatedUser.sellerUniversity || "",
          bio: updatedUser.bio || "",
          phone: updatedUser.phone || "",
          profileImage: updatedUser.profileImage || "",
        });
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error updating profile:", error.response ? error.response.data : error.message);
      setError("Failed to update profile");
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>;
  if (error) return <div style={{ textAlign: "center", padding: "20px", color: "red" }}>{error}</div>;
  if (!currentUser) return null;

  const cardStyle = {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
  };

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    padding: "8px 16px",
    marginRight: "10px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#007bff",
    color: "#fff",
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#6c757d",
    color: "#fff",
  };

  const imageStyle = {
    maxWidth: "200px",
    marginTop: "10px",
    borderRadius: "5px",
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>My Profile</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit} style={cardStyle}>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Email</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              disabled
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>University</label>
            <input
              type="text"
              name="sellerUniversity"
              value={profileData.sellerUniversity}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Bio</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              style={{ ...inputStyle, height: "100px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "5px" }}>Profile Image</label>
            <input
              type="file"
              name="profileImage"
              onChange={handleImageChange}
              style={inputStyle}
            />
            {profileData.profileImage && typeof profileData.profileImage !== "string" && (
              <p style={{ marginTop: "5px" }}>Selected file: {profileData.profileImage.name}</p>
            )}
          </div>
          <button
            type="submit"
            style={primaryButtonStyle}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            style={secondaryButtonStyle}
            onClick={() => setIsEditing(false)}
            disabled={loading}
          >
            Cancel
          </button>
        </form>
      ) : (
        <div style={cardStyle}>
          <h2 style={{ marginBottom: "20px" }}>Profile Details</h2>
          <p><strong>Name:</strong> {profileData.name}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>University:</strong> {profileData.sellerUniversity}</p>
          <p><strong>Bio:</strong> {profileData.bio || "Not set"}</p>
          <p><strong>Phone:</strong> {profileData.phone || "Not set"}</p>
          {profileData.profileImage && (
            <img
              src={profileData.profileImage}
              alt="Profile"
              style={imageStyle}
              onError={(e) => console.log("Image load error:", e)}
            />
          )}
          <button
            style={primaryButtonStyle}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;