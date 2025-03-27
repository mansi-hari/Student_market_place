import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast notifications
import './SellPage.css'; // Import the CSS file

const SellPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    otherCategory: "",
    price: "",
    description: "",
    condition: "New",
    tags: "",
    photos: null,
    location: "",
    pincode: "",
    fullAddress: "",
    negotiable: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setFormData({
      ...formData,
      photos: filesArray
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    for (let key in formData) {
      if (key === "photos" && Array.isArray(formData[key])) {
        formData[key].forEach((file) => {
          formDataToSend.append("photos", file);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      const response = await axios.post("http://localhost:5000/api/products", formDataToSend, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Show success toast notification
      toast.success("Item listed successfully!");

      // Reset form data after submission
      setFormData({
        title: "",
        category: "",
        otherCategory: "",
        price: "",
        description: "",
        condition: "New",
        tags: "",
        photos: null,
        location: "",
        pincode: "",
        fullAddress: "",
        negotiable: false
      });
    } catch (error) {
      console.error("Error listing item", error);
      toast.error("Error listing item!");
    }
  };

  return (
    <div className="sell-page-container container mt-5">
      <h2>List Your Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <label htmlFor="title" className="form-label col-12">Title</label>
          <input
            type="text"
            className="form-control col-12"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row mb-3">
          <label htmlFor="category" className="form-label col-12">Category</label>
          <select
            className="form-select col-12 col-md-6"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Furniture">Furniture</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {formData.category === "Others" && (
          <div className="row mb-3">
            <label htmlFor="otherCategory" className="form-label col-12">Other Category</label>
            <input
              type="text"
              className="form-control col-12"
              id="otherCategory"
              name="otherCategory"
              value={formData.otherCategory}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="row mb-3">
          <label htmlFor="price" className="form-label col-12">Price</label>
          <input
            type="number"
            className="form-control col-12 col-md-6"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row mb-3">
          <label htmlFor="description" className="form-label col-12">Description</label>
          <textarea
            className="form-control col-12"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="row mb-3">
          <label htmlFor="condition" className="form-label col-12">Condition</label>
          <select
            className="form-select col-12 col-md-6"
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
        </div>

        <div className="row mb-3">
          <label htmlFor="tags" className="form-label col-12">Tags</label>
          <input
            type="text"
            className="form-control col-12"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row mb-3">
          <label htmlFor="photos" className="form-label col-12">Photos</label>
          <input
            type="file"
            className="form-control col-12"
            id="photos"
            name="photos"
            onChange={handleFileChange}
            multiple
          />
        </div>

        <div className="row mb-3">
          <label htmlFor="location" className="form-label col-12">Location</label>
          <input
            type="text"
            className="form-control col-12 col-md-6"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row mb-3">
          <label htmlFor="pincode" className="form-label col-12">Pincode</label>
          <input
            type="text"
            className="form-control col-12 col-md-6"
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row mb-3">
          <label htmlFor="fullAddress" className="form-label col-12">Full Address (Optional)</label>
          <input
            type="text"
            className="form-control col-12"
            id="fullAddress"
            name="fullAddress"
            value={formData.fullAddress}
            onChange={handleChange}
          />
        </div>

        <div className="row mb-3">
          <div className="col-12 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="negotiable"
              name="negotiable"
              checked={formData.negotiable}
              onChange={(e) => setFormData({ ...formData, negotiable: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="negotiable">Negotiable</label>
          </div>
        </div>

        <div className="row mb-3">
          <button type="submit" className="btn btn-primary col-12">List Item</button>
        </div>
      </form>

      {/* ToastContainer to display the notifications */}
      <ToastContainer />
    </div>
  );
};

export default SellPage;
