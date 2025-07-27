"use client"

import { useState } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { adminAPI } from "../../services/api"
import Layout from "../../components/Layout"

const CreateStore = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      await adminAPI.createStore(formData)
      alert("Store created successfully!")
      navigate("/admin/stores")
    } catch (error) {
      if (error.response?.data?.errors) {
        const errorObj = {}
        error.response.data.errors.forEach((err) => {
          errorObj[err.path] = err.msg
        })
        setErrors(errorObj)
      } else {
        setErrors({ general: error.response?.data?.message || "Store creation failed" })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Header>
                <h4 className="mb-0">Create New Store</h4>
              </Card.Header>
              <Card.Body>
                {errors.general && (
                  <Alert variant="danger" className="mb-3">
                    {errors.general}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Store Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          isInvalid={!!errors.name}
                          required
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Store Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          isInvalid={!!errors.email}
                          required
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      Store Address <small className="text-muted">(max 400 characters)</small>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      isInvalid={!!errors.address}
                      required
                    />
                    <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      Owner ID <small className="text-muted">(optional - leave empty if no owner assigned)</small>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="ownerId"
                      value={formData.ownerId}
                      onChange={handleChange}
                      isInvalid={!!errors.ownerId}
                      placeholder="Enter user ID of store owner"
                    />
                    <Form.Control.Feedback type="invalid">{errors.ownerId}</Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      You can find the user ID from the "Manage Users" page. Only users with "store_owner" role can be
                      assigned.
                    </Form.Text>
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? "Creating..." : "Create Store"}
                    </Button>
                    <Button variant="secondary" onClick={() => navigate("/admin/dashboard")}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export default CreateStore
