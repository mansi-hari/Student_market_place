"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, Form, Button, Modal } from "react-bootstrap"
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa"
import { toast } from "react-hot-toast"

const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [categoryToEdit, setCategoryToEdit] = useState({ _id: "", name: "", slug: "", description: "" })
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:5000/api/categories")
      setCategories(response.data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast.error("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post("http://localhost:5000/api/admin/categories", newCategory, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setCategories([...categories, response.data])
      setNewCategory({ name: "", description: "" })
      setShowAddModal(false)
      toast.success("Category added successfully")
    } catch (error) {
      console.error("Error adding category:", error)
      toast.error("Failed to add category")
    }
  }

  const handleEditCategory = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(
        `http://localhost:5000/api/admin/categories/${categoryToEdit._id}`,
        categoryToEdit,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      setCategories(categories.map((category) => (category._id === categoryToEdit._id ? response.data : category)))

      setShowEditModal(false)
      toast.success("Category updated successfully")
    } catch (error) {
      console.error("Error updating category:", error)
      toast.error("Failed to update category")
    }
  }

  const handleDeleteCategory = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:5000/api/admin/categories/${categoryToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setCategories(categories.filter((category) => category._id !== categoryToDelete._id))
      setShowDeleteModal(false)
      toast.success("Category deleted successfully")
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error("Failed to delete category")
    }
  }

  const handleEditClick = (category) => {
    setCategoryToEdit({
      _id: category._id,
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    })
    setShowEditModal(true)
  }

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category)
    setShowDeleteModal(true)
  }

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target
    if (formType === "add") {
      setNewCategory({
        ...newCategory,
        [name]: value,
      })
    } else {
      setCategoryToEdit({
        ...categoryToEdit,
        [name]: value,
      })
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

  return (
    <div className="category-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Category Management</h2>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <FaPlus className="me-2" /> Add Category
        </Button>
      </div>

      <Card>
        <Card.Body>
          <div className="table-responsive">
            <table className="table table-hover admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Products</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td>{category.slug}</td>
                    <td>{category.description || "-"}</td>
                    <td>{category.productCount || 0}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2 admin-action-btn"
                        onClick={() => handleEditClick(category)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="admin-action-btn"
                        onClick={() => handleDeleteClick(category)}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* Add Category Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddCategory}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newCategory.name}
                onChange={(e) => handleInputChange(e, "add")}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newCategory.description}
                onChange={(e) => handleInputChange(e, "add")}
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Category
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Category Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditCategory}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={categoryToEdit.name}
                onChange={(e) => handleInputChange(e, "edit")}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Slug</Form.Label>
              <Form.Control
                type="text"
                name="slug"
                value={categoryToEdit.slug}
                onChange={(e) => handleInputChange(e, "edit")}
                required
              />
              <Form.Text className="text-muted">
                The slug is used in URLs. Use lowercase letters, numbers, and hyphens only.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={categoryToEdit.description}
                onChange={(e) => handleInputChange(e, "edit")}
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the category <strong>{categoryToDelete?.name}</strong>? This action cannot be
          undone and may affect products in this category.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteCategory}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default CategoryManagement

