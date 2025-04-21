
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../Context/AuthContext";
import "./SellPage.css";

const url = process.env.REACT_APP_API_URL;
const SellPage = () => {
  const { currentUser, getCurrentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    otherCategory: "",
    price: "",
    description: "",
    condition: "New",
    tags: "",
    photos: null,
    pincode: "",
    phoneNumber: "",
    email: "",
    negotiable: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [sellerCollege, setSellerCollege] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        try {
          const userData = await getCurrentUser();
         
          setSellerCollege(userData?.sellerUniversity || "");
          if (!sellerCollege) {
            toast.warn("Please update your profile with a college!");
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          toast.error("Failed to load profile data.");
        }
      }
    };
    fetchProfile();
  }, [currentUser, getCurrentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);

    if (filesArray.length > 5) {
      toast.error("You may upload a maximum of 5 photos.");
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      photos: filesArray,
    }));

    const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
    previewImages.forEach((url) => URL.revokeObjectURL(url));
    setPreviewImages(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number.parseFloat(formData.price) <= 0 || isNaN(formData.price)) {
      toast.error("Price must be a positive number.");
      return;
    }

    if (!sellerCollege) {
      toast.error("Please update your profile with a college first!");
      return;
    }

    if (!formData.pincode.trim() || isNaN(formData.pincode)) {
      toast.error("A valid pincode is required.");
      return;
    }

    if (!formData.photos || formData.photos.length === 0) {
      toast.error("Please upload at least one photo.");
      return;
    }

    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!formData.phoneNumber && !formData.email) {
      toast.error("Please provide at least one contact method (phone number or email).");
      return;
    }

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "photos") {
        formDataToSend.append(key, formData[key]);
      }
    });
    if (formData.photos) {
      formData.photos.forEach((file) => {
        formDataToSend.append("photos", file);
      });
    }
    formDataToSend.append("location", sellerCollege); 

    try {
      console.log("Submitting form data...", Object.fromEntries(formDataToSend));
      const response = await axios.post(`${url}/api/products`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        toast.success("Item listed successfully!");
        setFormData({
          title: "",
          category: "",
          otherCategory: "",
          price: "",
          description: "",
          condition: "New",
          tags: "",
          photos: null,
          pincode: "",
          phoneNumber: "",
          email: "",
          negotiable: false,
        });
        previewImages.forEach((url) => URL.revokeObjectURL(url));
        setPreviewImages([]);
      } else {
        toast.error(response.data.message || "An error occurred while listing the item.");
      }
    } catch (error) {
      console.error("Error listing item:", error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.message || "A server error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sell-page-container">
      <h2 className="mb-4">List Your Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header">Basic Information</div>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="title" className="form-label">Item Title</label>
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
              <div className="col-md-6 form-group">
                <label htmlFor="category" className="form-label">Category</label>
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
                <div className="col-md-6 form-group">
                  <label htmlFor="otherCategory" className="form-label">Specify Other Category</label>
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
              <div className="col-md-6 form-group">
                <label htmlFor="price" className="form-label">Price (₹)</label>
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

              <div className="col-md-6 form-group">
                <label htmlFor="condition" className="form-label">Condition</label>
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

            <div className="form-group">
              <label htmlFor="description" className="form-label">Description</label>
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

            <div className="form-group">
              <label htmlFor="tags" className="form-label">Tags (comma-separated)</label>
              <input
                type="text"
                className="form-control"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g., laptop, electronics, hp"
              />
              <small className="text-muted">Separate tags with commas for better searchability.</small>
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
              <label className="form-check-label" htmlFor="negotiable">Price is negotiable</label>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Contact Details</div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6 form-group">
                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                />
                <small className="text-muted">At least one contact method is required.</small>
              </div>

              <div className="col-md-6 form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
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
          <div className="card-header">Product Images</div>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="photos" className="form-label">Upload Images (Maximum 5)</label>
              <input
                type="file"
                className="form-control"
                id="photos"
                name="photos"
                onChange={handleFileChange}
                multiple
                accept="image/*"
              />
              <small className="text-muted">Please upload clear and high-quality images of your product.</small>
            </div>

            {previewImages.length > 0 && (
              <div className="form-group">
                <label className="form-label">Image Previews</label>
                <div className="row">
                  {previewImages.map((url, index) => (
                    <div key={index} className="col-md-3 mb-2">
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="img-thumbnail"
                        style={{ height: "150px", objectFit: "cover", width: "100%" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">Location Details</div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6 form-group">
                <label htmlFor="pincode" className="form-label">Pincode</label>
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
              <div className="col-md-6 form-group">
                <label className="form-label">College Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={sellerCollege || "Loading..."}
                  readOnly
                />
                <small className="text-muted">This is set from your profile.</small>
              </div>
            </div>
          </div>
        </div>

        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-primary btn-lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Submitting Listing...
              </>
            ) : (
              "Submit Listing"
            )}
          </button>
        </div>
      </form>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default SellPage;