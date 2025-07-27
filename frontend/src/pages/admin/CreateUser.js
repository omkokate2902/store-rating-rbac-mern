"use client"

import { useState } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { adminAPI } from "../../services/api"
import Layout from "../../components/Layout"

const CreateUser = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "user", // default to user
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      })
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      await adminAPI.createUser(userData)
      alert("User created successfully!")
      navigate("/admin/users") // go back to users list
    } catch (error) {
      console.log("Error creating user:", error)
      if (error.response?.data?.errors) {
        const errorObj = {}
        error.response.data.errors.forEach((err) => {
          errorObj[err.path] = err.msg
        })
        setErrors(errorObj)
      } else {
        setErrors({ general: error.response?.data?.message || "Failed to create user" })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Header>
                <h4>Add New User</h4>
              </Card.Header>
              <Card.Body>
                {errors.general && <Alert variant="danger">{errors.general}</Alert>}

                <Form onSubmit={handleFormSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Full Name (20-60 characters required)</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={userData.name}
                          onChange={handleInputChange}
                          isInvalid={!!errors.name}
                          required
                          placeholder="Enter full name"
                        />
                        <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={userData.email}
                          onChange={handleInputChange}
                          isInvalid={!!errors.email}
                          required
                          placeholder="Enter email address"
                        />
                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Password (8-16 chars, 1 uppercase, 1 special char)</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          value={userData.password}
                          onChange={handleInputChange}
                          isInvalid={!!errors.password}
                          required
                          placeholder="Create password"
                        />
                        <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>User Role</Form.Label>
                        <Form.Select
                          name="role"
                          value={userData.role}
                          onChange={handleInputChange}
                          isInvalid={!!errors.role}
                          required
                        >
                          <option value="user">Normal User</option>
                          <option value="admin">System Administrator</option>
                          <option value="store_owner">Store Owner</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.role}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Address (optional, max 400 characters)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="address"
                      value={userData.address}
                      onChange={handleInputChange}
                      isInvalid={!!errors.address}
                      placeholder="Enter address"
                    />
                    <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button variant="primary" type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Creating User..." : "Create User"}
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

export default CreateUser
