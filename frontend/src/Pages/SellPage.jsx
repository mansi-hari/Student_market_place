"use client"

import { useState } from "react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./SellPage.css"

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
    phoneNumber: "",
    email: "",
    negotiable: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImages, setPreviewImages] = useState([])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files)

    // Limit to 5 images
    if (filesArray.length > 5) {
      toast.error("You can upload a maximum of 5 photos.")
      return
    }

    setFormData({
      ...formData,
      photos: filesArray,
    })

    // Generate preview URLs
    const newPreviews = filesArray.map((file) => URL.createObjectURL(file))

    // Revoke old preview URLs to avoid memory leaks
    previewImages.forEach((url) => URL.revokeObjectURL(url))

    setPreviewImages(newPreviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validation
    if (Number.parseFloat(formData.price) <= 0 || isNaN(formData.price)) {
      toast.error("Price must be a positive number.")
      return
    }

    if (!formData.location.trim()) {
      toast.error("Location is required.")
      return
    }

    if (!formData.pincode.trim() || isNaN(formData.pincode)) {
      toast.error("Valid Pincode is required.")
      return
    }

    if (!formData.photos || formData.photos.length === 0) {
      toast.error("Please upload at least one photo.")
      return
    }

    // Validate phone number format if provided
    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number.")
      return
    }

    // Validate email format if provided
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address.")
      return
    }

    // Require at least one contact method
    if (!formData.phoneNumber && !formData.email) {
      toast.error("Please provide either a phone number or email for contact.")
      return
    }

    setIsSubmitting(true)

    // Create FormData object for file upload
    const formDataToSend = new FormData()

    // Add text fields
    Object.keys(formData).forEach((key) => {
      if (key !== "photos") {
        formDataToSend.append(key, formData[key])
      }
    })

    // Add photos
    if (formData.photos) {
      formData.photos.forEach((file) => {
        formDataToSend.append("photos", file)
      })
    }

    try {
      console.log("Submitting form data...")

      const response = await axios.post("http://localhost:5000/api/products", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Response:", response.data)

      if (response.data.success) {
        toast.success("Item listed successfully!")

        // Reset form
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
          phoneNumber: "",
          email: "",
          negotiable: false,
        })

        // Clear preview images
        previewImages.forEach((url) => URL.revokeObjectURL(url))
        setPreviewImages([])
      } else {
        toast.error(response.data.message || "Error listing item!")
      }
    } catch (error) {
      console.error("Error listing item:", error)
      toast.error(error.response?.data?.message || "Error listing item!")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="sell-page-container container mt-5">
      <h2 className="mb-4">List Your Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header">Basic Information</div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
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
                  <option value="">Select Category</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Books">Books</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Supplies">Supplies</option>
                  <option value="Transport">Transport</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {formData.category === "Others" && (
                <div className="col-md-6">
                  <label htmlFor="otherCategory" className="form-label">
                    Other Category
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="otherCategory"
                    name="otherCategory"
                    value={formData.otherCategory}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
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
                  required
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="condition" className="form-label">
                  Condition
                </label>
                <select
                  className="form-select"
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                >
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Used">Used</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
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
                placeholder="e.g. laptop, electronics, hp"
              />
            </div>

            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="negotiable"
                name="negotiable"
                checked={formData.negotiable}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="negotiable">
                Price is negotiable
              </label>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Contact Information</div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="phoneNumber" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                />
                <small className="text-muted">At least one contact method is required</small>
              </div>

              <div className="col-md-6">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Photos</div>
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="photos" className="form-label">
                Upload Photos (Max 5)
              </label>
              <input
                type="file"
                className="form-control"
                id="photos"
                name="photos"
                onChange={handleFileChange}
                multiple
                accept="image/*"
              />
              <div className="form-text">Please upload clear images of your product</div>
            </div>

            {previewImages.length > 0 && (
              <div className="mb-3">
                <label className="form-label">Photo Previews</label>
                <div className="row">
                  {previewImages.map((url, index) => (
                    <div key={index} className="col-md-3 mb-2">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="img-thumbnail"
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Location</div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="location" className="form-label">
                  City/Area
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="pincode" className="form-label">
                  Pincode
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="fullAddress" className="form-label">
                Full Address (Optional)
              </label>
              <textarea
                className="form-control"
                id="fullAddress"
                name="fullAddress"
                rows="2"
                value={formData.fullAddress}
                onChange={handleChange}
                placeholder="This will only be shared with buyers after you approve"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Listing Item...
              </>
            ) : (
              "List Item for Sale"
            )}
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  )
}

export default SellPage

