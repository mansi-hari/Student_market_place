import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SellPage.css";

const SellPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

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
    pincode: "",
    fullAddress: "",
    negotiable: false,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        console.log("Fetched categories:", response.data);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

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
      toast.error("You can upload a maximum of 5 photos");
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
    setIsLoading(true);

    try {
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
      submissionData.append("pincode", formData.pincode);
      submissionData.append("fullAddress", formData.fullAddress);
      submissionData.append("negotiable", formData.negotiable);

      formData.photos.forEach((photo) => {
        submissionData.append("photos", photo);
      });

      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/products", submissionData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Item listed successfully!");

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
        pincode: "",
        fullAddress: "",
        negotiable: false,
      });

      navigate("/");
    } catch (error) {
      console.error("Error listing item:", error);
      toast.error(error.response?.data?.message || "Failed to list item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">List Your Item</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Item Title</label>
                  <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select className="form-select" name="category" value={formData.category} onChange={handleChange} required>
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
                    <label className="form-label">Specify Category</label>
                    <input type="text" className="form-control" name="otherCategory" value={formData.otherCategory} onChange={handleChange} required />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Price (₹)</label>
                  <input type="number" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Photos (Max: 5)</label>
                  <input type="file" className="form-control" accept="image/*" multiple onChange={handlePhotoUpload} />
                </div>

                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <input type="text" className="form-control" name="location" value={formData.location} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Pincode</label>
                  <input type="text" className="form-control" name="pincode" value={formData.pincode} onChange={handleChange} required />
                </div>

                <div className="mb-3">
                  <label className="form-label">Full Address (Optional)</label>
                  <textarea className="form-control" name="fullAddress" value={formData.fullAddress} onChange={handleChange} rows="3" />
                </div>

                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="3" required />
                </div>

                <div className="mb-4 form-check">
                  <input type="checkbox" className="form-check-input" name="negotiable" checked={formData.negotiable} onChange={handleChange} />
                  <label className="form-check-label">Price Negotiable</label>
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isLoading}>
                  {isLoading ? "Listing Item..." : "List Item"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellPage;
