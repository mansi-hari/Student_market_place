import bcrypt from 'bcrypt';
const hashedPassword = await bcrypt.hash('123456', 10);
console.log('Hashed Password:', hashedPassword); // Compare this with the stored hash



"use client"

import { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./SellPage.css"

const SellPage = () => {
  
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState([])

  const [formData, setFormData] = useState({
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
  })

  // Fetch categories on component mount
  useEffect(() => {
    
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        // You can replace this with actual API call when ready
         const response = await axios.get("/api/categories");
         setCategories(response.data);

        // For now, use hardcoded categories
        setCategories([
          { id: "1", name: "Electronics" },
          { id: "2", name: "Books" },
          { id: "3", name: "Furniture" },
          { id: "4", name: "vehicle" },
          { id: "5", name: "Sports" },
          { id: "6", name: "Others" },
        ])
      } catch (error) {
        console.error("Error fetching categories:", error)
        toast.error("Failed to load categories")
      }
    }

    fetchCategories()
  }, [navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + formData.photos.length > 5) {
      toast.error("You can upload a maximum of 5 photos")
      return
    }
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }))
  }

  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create FormData object for file upload
      const submissionData = new FormData()
      submissionData.append("title", formData.title)
      submissionData.append("category", formData.category === "Others" ? formData.otherCategory : formData.category)
      submissionData.append("price", formData.price)
      submissionData.append("description", formData.description)
      submissionData.append("condition", formData.condition)
      submissionData.append("tags", formData.tags)
      submissionData.append("location", formData.location)
      submissionData.append("negotiable", formData.negotiable)

      // Append each photo to the FormData
      formData.photos.forEach((photo) => {
        submissionData.append("photos", photo)
      })

      // Get token from localStorage
      const token = localStorage.getItem("token")

      // Send request to backend
      const response = await axios.post("http://localhost:5000/api/sell", submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })

      toast.success("Item listed successfully!")

      // Reset form after successful submission
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
      })

      // Navigate to homepage or product page
      navigate("/")
    } catch (error) {
      console.error("Error listing item:", error)
      toast.error(error.response?.data?.message || "Failed to list item. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">List Your Item</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Item Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., MacBook Pro 2021"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.category === "Others" && (
                  <div className="mb-3">
                    <label htmlFor="otherCategory" className="form-label">
                      Specify Category
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="otherCategory"
                      name="otherCategory"
                      value={formData.otherCategory}
                      onChange={handleChange}
                      placeholder="Enter category name"
                      required
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="location" className="form-label">
                    Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Pune, FC Road"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Condition</label>
                  <div className="d-flex gap-3">
                    {["New", "Like New", "Good", "Fair"].map((cond) => (
                      <div key={cond} className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="condition"
                          id={`condition-${cond}`}
                          value={cond}
                          checked={formData.condition === cond}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor={`condition-${cond}`}>
                          {cond}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="photos" className="form-label">
                    Photos (Max: 5)
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="photos"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                  />
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="position-relative" style={{ width: "100px" }}>
                        <img
                          src={URL.createObjectURL(photo) || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="img-thumbnail"
                          style={{ width: "100%", height: "100px", objectFit: "cover" }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0"
                          onClick={() => removePhoto(index)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="tags" className="form-label">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g., laptop, apple, electronics"
                  />
                </div>

                <div className="mb-4 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="negotiable"
                    name="negotiable"
                    checked={formData.negotiable}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="negotiable">
                    Price Negotiable
                  </label>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Listing Item...
                      </>
                    ) : (
                      "List Item"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SellPage

