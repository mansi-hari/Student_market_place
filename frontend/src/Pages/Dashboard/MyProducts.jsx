"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Row, Col, Card, Button, Badge, Modal, Form } from "react-bootstrap"
import { FaEdit, FaTrash, FaEye, FaCheck, FaTimes, FaPlus, FaShoppingBag } from "react-icons/fa"
import { toast } from "react-hot-toast"
import { Link } from "react-router-dom"

const MyProducts = ({ refreshStats }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editProduct, setEditProduct] = useState({
    _id: "",
    title: "",
    price: "",
    description: "",
    category: "",
    condition: "",
    isAvailable: true,
  })
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:5000/api/user/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setProducts(response.data)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to load your products")
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

  const handleDeleteClick = (product) => {
    setProductToDelete(product)
    setShowDeleteModal(true)
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
    })
    setShowEditModal(true)
  }

  const handleDeleteProduct = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:5000/api/products/${productToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setProducts(products.filter((product) => product._id !== productToDelete._id))
      toast.success("Product deleted successfully")
      setShowDeleteModal(false)

      // Refresh stats after deletion
      if (refreshStats) refreshStats()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("Failed to delete product")
    }
  }

  const handleUpdateProduct = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(`http://localhost:5000/api/products/${editProduct._id}`, editProduct, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setProducts(products.map((product) => (product._id === editProduct._id ? response.data : product)))

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

  const toggleProductAvailability = async (productId, isAvailable) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.patch(
        `http://localhost:5000/api/products/${productId}/availability`,
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

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <FaShoppingBag />
        </div>
        <h3>No Products Listed</h3>
        <p>You haven't listed any products for sale yet.</p>
        <Link to="/sell" className="btn btn-primary">
          <FaPlus className="me-2" /> List an Item
        </Link>
      </div>
    )
  }

  return (
    <div className="my-products">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>My Products</h3>
        <Link to="/sell" className="btn btn-primary">
          <FaPlus className="me-2" /> List New Item
        </Link>
      </div>

      <Row>
        {products.map((product) => (
          <Col lg={4} md={6} className="mb-4" key={product._id}>
            <Card className="product-card h-100">
              <div className="product-image">
                {product.photos && product.photos.length > 0 ? (
                  <img
                    src={`http://localhost:5000/uploads/${product.photos[0]}`}
                    alt={product.title}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "https://via.placeholder.com/300x200"
                    }}
                  />
                ) : (
                  <div className="d-flex justify-content-center align-items-center h-100 bg-light">No Image</div>
                )}
                <Badge bg={product.isAvailable !== false ? "success" : "secondary"} className="product-status">
                  {product.isAvailable !== false ? "Available" : "Unavailable"}
                </Badge>
                <div className="product-actions">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => toggleProductAvailability(product._id, product.isAvailable)}
                    title={product.isAvailable ? "Mark as Unavailable" : "Mark as Available"}
                  >
                    {product.isAvailable ? <FaTimes /> : <FaCheck />}
                  </Button>
                  <Button variant="light" size="sm" as={Link} to={`/product/${product._id}`} title="View Product">
                    <FaEye />
                  </Button>
                  <Button variant="light" size="sm" onClick={() => handleEditClick(product)} title="Edit Product">
                    <FaEdit />
                  </Button>
                  <Button variant="light" size="sm" onClick={() => handleDeleteClick(product)} title="Delete Product">
                    <FaTrash />
                  </Button>
                </div>
              </div>
              <div className="product-info">
                <h5 className="product-title">{product.title}</h5>
                <p className="product-price">₹{product.price}</p>
                <div className="product-meta">
                  <span>{product.condition}</span>
                  <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{productToDelete?.title}</strong>? This action cannot be undone.
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

export default MyProducts

