"use client"

import { useState } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { authAPI } from "../services/api"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
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
      const response = await authAPI.login(formData)
      const { token, user } = response.data

      login(token, user)

      // redirect based on user role
      if (user.role === "admin") {
        navigate("/admin/dashboard")
      } else if (user.role === "store_owner") {
        navigate("/store-owner/dashboard")
      } else {
        navigate("/user/stores")
      }
    } catch (error) {
      console.log("Login error:", error)
      if (error.response?.data?.errors) {
        const errorObj = {}
        error.response.data.errors.forEach((err) => {
          errorObj[err.path] = err.msg
        })
        setErrors(errorObj)
      } else {
        setErrors({ general: error.response?.data?.message || "Login failed" })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Header>
                <h3>Login to Your Account</h3>
              </Card.Header>
              <Card.Body>
                {errors.general && <Alert variant="danger">{errors.general}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      required
                      placeholder="Enter your email"
                    />
                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      required
                      placeholder="Enter your password"
                    />
                    <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                  </Form.Group>

                  <Button variant="primary" type="submit" disabled={loading} className="w-100">
                    {loading ? "Please wait..." : "Login"}
                  </Button>
                </Form>

                <hr />
                <div className="text-center">
                  <p>
                    Don't have an account? <Link to="/register">Sign up here</Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login
