"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, Form, Button, Modal, Badge } from "react-bootstrap"
import { FaEdit, FaTrash, FaSearch, FaCheck, FaTimes, FaEye } from "react-icons/fa"
import { toast } from "react-hot-toast"

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewProduct, setViewProduct] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editProduct, setEditProduct] = useState({
    _id: "",
    title: "",
    price: "",
    description: "",
    category: "",
    condition: "",
    isAvailable: true,
    isFeatured: false,
  })
  const [categories, setCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(10)
  const [filterCategory, setFilterCategory] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, filterCategory, filterStatus, products])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:5000/api/admin/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setProducts(response.data)
      setFilteredProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/categories")
      setCategories(response.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter((product) => product.category === filterCategory)
    }

    // Apply status filter
    if (filterStatus === "available") {
      filtered = filtered.filter((product) => product.isAvailable)
    } else if (filterStatus === "unavailable") {
      filtered = filtered.filter((product) => !product.isAvailable)
    } else if (filterStatus === "featured") {
      filtered = filtered.filter((product) => product.isFeatured)
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryFilterChange = (e) => {
    setFilterCategory(e.target.value)
  }

  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value)
  }

  const handleDeleteClick = (product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
  }

  const handleViewClick = (product) => {
    setViewProduct(product)
    setShowViewModal(true)
  }

  const handleEditClick = (product) => {
    setEditProduct({
      _id: product._id,
      title: product.title,
      price: product.price,
      description: product.description,
      category: product.category,
      condition: product.condition,
      isAvailable: product.isAvailable !== false,
      isFeatured: product.isFeatured === true,
    })
    setShowEditModal(true)
  }

  const handleDeleteProduct = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:5000/api/admin/products/${productToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setProducts(products.filter((product) => product._id !== productToDelete._id))
      toast.success("Product deleted successfully")
      setShowDeleteModal(false)
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product")
    }
  }

  const handleUpdateProduct = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(`http://localhost:5000/api/admin/products/${editProduct._id}`, editProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setProducts(
        products.map((product) => (product._id === editProduct._id ? { ...product, ...response.data } : product)),
      )

      toast.success("Product updated successfully")
      setShowEditModal(false)
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Failed to update product")
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditProduct({
      ...editProduct,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const toggleProductFeatured = async (productId, isFeatured) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.patch(
        `http://localhost:5000/api/admin/products/${productId}/featured`,
        { isFeatured: !isFeatured },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setProducts(
        products.map((product) => (product._id === productId ? { ...product, isFeatured: !isFeatured } : product)),
      )

      toast.success(`Product ${!isFeatured ? "added to" : "removed from"} featured listings`)
    } catch (error) {
      console.error("Error updating product featured status:", error)
      toast.error("Failed to update product")
    }
  }

  const toggleProductAvailability = async (productId, isAvailable) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.patch(
        `http://localhost:5000/api/admin/products/${productId}/availability`,
        { isAvailable: !isAvailable },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setProducts(
        products.map((product) => (product._id === productId ? { ...product, isAvailable: !isAvailable } : product)),
      )

      toast.success(`Product marked as ${!isAvailable ? "available" : "unavailable"}`)
    } catch (error) {
      console.error("Error updating product availability:", error)
      toast.error("Failed to update product")
    }
  }

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="product-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Product Management</h2>
        <div className="admin-search-box">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-4">
          <Form.Group>
            <Form.Label>Filter by Category</Form.Label>
            <Form.Select value={filterCategory} onChange={handleCategoryFilterChange}>
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>
        <div className="col-md-4">
          <Form.Group>
            <Form.Label>Filter by Status</Form.Label>
            <Form.Select value={filterStatus} onChange={handleStatusFilterChange}>
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
              <option value="featured">Featured</option>
            </Form.Select>
          </Form.Group>
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={() => {
              setSearchTerm("")
              setFilterCategory("")
              setFilterStatus("")
            }}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      <Card>
        <Card.Body>
          <div className="table-responsive">
            <table className="table table-hover admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Condition</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product.title}</td>
                    <td>₹{product.price}</td>
                    <td>{product.category?.name || "Uncategorized"}</td>
                    <td>{product.condition}</td>
                    <td>
                      <Badge bg={product.isAvailable !== false ? "success" : "secondary"}>
                        {product.isAvailable !== false ? "Available" : "Unavailable"}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={product.isFeatured ? "warning" : "light"} text={product.isFeatured ? "dark" : "dark"}>
                        {product.isFeatured ? "Featured" : "Regular"}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="outline-info"
                        size="sm"
                        className="me-1 admin-action-btn"
                        onClick={() => handleViewClick(product)}
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-1 admin-action-btn"
                        onClick={() => handleEditClick(product)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="me-1 admin-action-btn"
                        onClick={() => toggleProductAvailability(product._id, product.isAvailable)}
                        title={product.isAvailable ? "Mark as Unavailable" : "Mark as Available"}
                      >
                        {product.isAvailable ? <FaCheck /> : <FaTimes />}
                      </Button>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="me-1 admin-action-btn"
                        onClick={() => toggleProductFeatured(product._id, product.isFeatured)}
                        title={product.isFeatured ? "Remove from Featured" : "Add to Featured"}
                      >
                        {product.isFeatured ? <FaTimes /> : <FaCheck />}
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="admin-action-btn"
                        onClick={() => handleDeleteClick(product)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="admin-pagination">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                    Previous
                  </button>
                </li>
                {[...Array(totalPages).keys()].map((number) => (
                  <li key={number + 1} className={`page-item ${currentPage === number + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => paginate(number + 1)}>
                      {number + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the product <strong>{productToDelete?.title}</strong>? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteProduct}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Product Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewProduct && (
            <div>
              <div className="row mb-4">
                <div className="col-md-6">
                  {viewProduct.photos && viewProduct.photos.length > 0 ? (
                    <img
                      src={`http://localhost:5000/uploads/${viewProduct.photos[0]}`}
                      alt={viewProduct.title}
                      className="img-fluid rounded"
                      style={{ maxHeight: "300px", objectFit: "cover" }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "https://via.placeholder.com/300"
                      }}
                    />
                  ) : (
                    <div
                      className="bg-light rounded d-flex justify-content-center align-items-center"
                      style={{ height: "300px" }}
                    >
                      No Image Available
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <h3>{viewProduct.title}</h3>
                  <p className="fs-4 fw-bold text-primary">₹{viewProduct.price}</p>
                  <p>
                    <strong>Category:</strong> {viewProduct.category?.name || "Uncategorized"}
                  </p>
                  <p>
                    <strong>Condition:</strong> {viewProduct.condition}
                  </p>
                  <p>
                    <strong>Status:</strong> {viewProduct.isAvailable !== false ? "Available" : "Unavailable"}
                  </p>
                  <p>
                    <strong>Featured:</strong> {viewProduct.isFeatured ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Seller:</strong> {viewProduct.seller?.name || "Unknown"}
                  </p>
                  <p>
                    <strong>Location:</strong> {viewProduct.location || "Not specified"}
                  </p>
                  <p>
                    <strong>Posted on:</strong> {new Date(viewProduct.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <h5>Description</h5>
                <p>{viewProduct.description}</p>
              </div>
              {viewProduct.photos && viewProduct.photos.length > 1 && (
                <div>
                  <h5>Additional Photos</h5>
                  <div className="row">
                    {viewProduct.photos.slice(1).map((photo, index) => (
                      <div key={index} className="col-md-3 mb-3">
                        <img
                          src={`http://localhost:5000/uploads/${photo}`}
                          alt={`${viewProduct.title} - ${index + 2}`}
                          className="img-fluid rounded"
                          style={{ height: "100px", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "https://via.placeholder.com/100"
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setShowViewModal(false)
              handleEditClick(viewProduct)
            }}
          >
            Edit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateProduct}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={editProduct.title} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={editProduct.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editProduct.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={editProduct.category} onChange={handleInputChange}>
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Condition</Form.Label>
              <Form.Select name="condition" value={editProduct.condition} onChange={handleInputChange}>
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Used">Used</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Available"
                name="isAvailable"
                checked={editProduct.isAvailable}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Featured"
                name="isFeatured"
                checked={editProduct.isFeatured}
                onChange={handleInputChange}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default ProductManagement

