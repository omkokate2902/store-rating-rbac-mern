"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap"
import { useParams, useNavigate } from "react-router-dom"
import { adminAPI } from "../../services/api"
import Layout from "../../components/Layout"

const UserDetails = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserDetails()
  }, [userId])

  const fetchUserDetails = async () => {
    try {
      const response = await adminAPI.getUsers({})
      const foundUser = response.data.find((u) => u.id === Number.parseInt(userId))
      setUser(foundUser)
    } catch (error) {
      console.error("Error fetching user details:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case "admin":
        return "danger"
      case "store_owner":
        return "warning"
      default:
        return "primary"
    }
  }

  const renderStars = (rating) => {
    const numRating = Number.parseFloat(rating) || 0
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.round(numRating) ? "#ffc107" : "#dee2e6" }}>
        ★
      </span>
    ))
  }

  if (loading) {
    return (
      <Layout>
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return (
      <Layout>
        <Container>
          <div className="text-center py-5">
            <h3 className="text-danger">User not found</h3>
            <Button variant="primary" onClick={() => navigate("/admin/users")}>
              Back to Users
            </Button>
          </div>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-6 fw-bold text-dark">User Details</h1>
          <Button variant="secondary" onClick={() => navigate("/admin/users")}>
            Back to Users
          </Button>
        </div>

        <Row>
          <Col md={8}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">User Information</h5>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col sm={3}>
                    <strong>ID:</strong>
                  </Col>
                  <Col sm={9}>{user.id}</Col>
                </Row>

                <Row className="mb-3">
                  <Col sm={3}>
                    <strong>Name:</strong>
                  </Col>
                  <Col sm={9}>{user.name}</Col>
                </Row>

                <Row className="mb-3">
                  <Col sm={3}>
                    <strong>Email:</strong>
                  </Col>
                  <Col sm={9}>{user.email}</Col>
                </Row>

                <Row className="mb-3">
                  <Col sm={3}>
                    <strong>Address:</strong>
                  </Col>
                  <Col sm={9}>{user.address || "N/A"}</Col>
                </Row>

                <Row className="mb-3">
                  <Col sm={3}>
                    <strong>Role:</strong>
                  </Col>
                  <Col sm={9}>
                    <Badge bg={getRoleBadgeVariant(user.role)} className="text-capitalize">
                      {user.role.replace("_", " ")}
                    </Badge>
                  </Col>
                </Row>

                {user.role === "store_owner" && (
                  <Row className="mb-3">
                    <Col sm={3}>
                      <strong>Store Rating:</strong>
                    </Col>
                    <Col sm={9}>
                      <div className="d-flex align-items-center">
                        {renderStars(user.store_rating || 0)}
                        <span className="ms-2 text-muted">
                          ({Number.parseFloat(user.store_rating || 0).toFixed(1)}/5.0)
                        </span>
                      </div>
                    </Col>
                  </Row>
                )}

                <Row className="mb-3">
                  <Col sm={3}>
                    <strong>Created At:</strong>
                  </Col>
                  <Col sm={9}>
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" onClick={() => navigate("/admin/users")}>
                    View All Users
                  </Button>
                  <Button variant="outline-success" onClick={() => navigate("/admin/create-user")}>
                    Create New User
                  </Button>
                  {user.role === "store_owner" && (
                    <Button variant="outline-info" onClick={() => navigate("/admin/stores")}>
                      View Store Details
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export default UserDetails
