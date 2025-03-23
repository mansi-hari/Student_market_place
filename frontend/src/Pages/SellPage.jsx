import React, { useState } from "react";
import axios from "axios";

import "./SellPage.css"; // Ensure you have this CSS file for styling

const SellPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    otherCategory: "", // Added for "Others" input
    price: "",
    description: "",
    condition: "New",
    tags: "",
    photos: [],
    location: "",
    negotiable: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.photos.length > 5) {
      alert("You can upload a maximum of 5 photos.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
  };

  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append("title", formData.title);
    submissionData.append(
      "category",
      formData.category === "Others" ? formData.otherCategory : formData.category
    );
    submissionData.append("price", formData.price);
    submissionData.append("description", formData.description);
    submissionData.append("condition", formData.condition);
    submissionData.append("tags", formData.tags);
    submissionData.append("location", formData.location);
    submissionData.append("negotiable", formData.negotiable);

    formData.photos.forEach((photo) => {
      submissionData.append("photos", photo);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/products",
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Listing Item:", response.data);
      alert("Item listed successfully!");

      // Clear form fields after submission
      setFormData({
        title: "",
        category: "",
        otherCategory: "",
        price: "",
        description: "",
        condition: "New",
        tags: "",
        photos: [],
        location: "",
        negotiable: false,
      });
    } catch (error) {
      console.error("Error listing item:", error);
      alert("There was an error listing the item. Please try again.");
    }
  };

  return (
    <div className="sell-container">
      <h2 className="sell-title">List Your Item</h2>
      <form onSubmit={handleSubmit} className="sell-form">
        <div className="sell-field">
          <label>Item Title</label>
          <input
            type="text"
            name="title"
            placeholder="e.g., MacBook Pro 2021"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="sell-field">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Books">Books</option>
            <option value="Transport">Transport</option>
            <option value="Supplies">Supplies</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Show input field if 'Others' is selected */}
        {formData.category === "Others" && (
          <div className="sell-field">
            <label>Enter Category Name</label>
            <input
              type="text"
              name="otherCategory"
              placeholder="Enter category name"
              value={formData.otherCategory}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="sell-field">
          <label>Price (in ₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="sell-field">
          <label>Location</label>
          <input
            type="text"
            name="location"
            placeholder="e.g., Pune, FC Road"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="sell-field">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="sell-field">
          <label>Photos (Max: 5)</label>
          <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} />
          <div className="photo-preview">
            {formData.photos.map((photo, index) => (
              <div key={index} className="photo-container">
                <img src={URL.createObjectURL(photo)} alt="preview" />
                <button
                  type="button"
                  className="remove-photo"
                  onClick={() => removePhoto(index)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="sell-field">
          <label>Condition</label>
          <div>
            {["New", "Like New", "Good", "Fair"].map((cond) => (
              <label key={cond} className="condition-option">
                <input
                  type="radio"
                  name="condition"
                  value={cond}
                  checked={formData.condition === cond}
                  onChange={handleChange}
                />
                {cond}
              </label>
            ))}
          </div>
        </div>

        <div className="sell-field">
          <label>Tags</label>
          <input
            type="text"
            name="tags"
            placeholder="Add tags separated by commas"
            value={formData.tags}
            onChange={handleChange}
          />
        </div>

        <div className="sell-field negotiable-field">
          <label>
            <input
              type="checkbox"
              name="negotiable"
              checked={formData.negotiable}
              onChange={handleChange}
            />
            Price Negotiable
          </label>
        </div>

        <div className="sell-buttons">
          <button type="submit" className="submit-btn">
            List Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellPage;
