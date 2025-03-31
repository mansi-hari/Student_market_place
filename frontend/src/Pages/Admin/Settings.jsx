"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap"
import { toast } from "react-hot-toast"

const Settings = () => {
  const [settings, setSettings] = useState({
    siteName: "Student Marketplace",
    siteDescription: "Buy and sell items within your campus community",
    contactEmail: "support@studentmarketplace.com",
    featuredProductsLimit: 8,
    allowUserRegistration: true,
    requireEmailVerification: true,
    maintenanceMode: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:5000/api/admin/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setSettings(response.data)
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      const token = localStorage.getItem("token")
      await axios.put("http://localhost:5000/api/admin/settings", settings, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setSuccess(true)
      toast.success("Settings updated successfully")

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Error updating settings:", error)
      toast.error("Failed to update settings")
    } finally {
      setSaving(false)
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
    <div className="settings">
      <h2 className="mb-4">Site Settings</h2>

      {success && (
        <Alert variant="success" className="mb-4">
          Settings have been updated successfully!
        </Alert>
      )}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Site Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="contactEmail"
                    value={settings.contactEmail}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Site Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Featured Products Limit</Form.Label>
                  <Form.Control
                    type="number"
                    name="featuredProductsLimit"
                    value={settings.featuredProductsLimit}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                  />
                </Form.Group>
              </Col>
            </Row>

            <h4 className="mt-4 mb-3">User Settings</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Allow User Registration"
                    name="allowUserRegistration"
                    checked={settings.allowUserRegistration}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Require Email Verification"
                    name="requireEmailVerification"
                    checked={settings.requireEmailVerification}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <h4 className="mt-4 mb-3">System Settings</h4>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Maintenance Mode"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleInputChange}
              />
              <Form.Text className="text-muted">When enabled, only administrators can access the site.</Form.Text>
            </Form.Group>

            <div className="d-flex justify-content-end mt-4">
              <Button variant="primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Settings

