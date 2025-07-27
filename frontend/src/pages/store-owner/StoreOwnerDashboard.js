"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap"
import { storeAPI } from "../../services/api"
import Layout from "../../components/Layout"

const StoreOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await storeAPI.getOwnerDashboard()
      setDashboardData(response.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? "#ffc107" : "#dee2e6" }}>
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

  if (!dashboardData) {
    return (
      <Layout>
        <Container>
          <div className="text-center">
            <h3 className="text-danger">No store found</h3>
            <p>Please contact administrator.</p>
          </div>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container>
        <h1>Store Owner Dashboard</h1>

        <Row className="mb-4">
          <Col>
            <Card className="bg-primary text-white">
              <Card.Body>
                <h3>{dashboardData.store.name}</h3>
                <div>
                  <strong>Average Rating: </strong>
                  {renderStars(Math.round(Number.parseFloat(dashboardData.averageRating)))}
                  <span className="ms-2">{dashboardData.averageRating}/5.0</span>
                </div>
                <div className="mt-2">
                  <strong>Total Ratings: {dashboardData.ratingUsers.length}</strong>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5>Customer Ratings</h5>
              </Card.Header>
              <Card.Body className="p-0">
                {dashboardData.ratingUsers.length > 0 ? (
                  <ListGroup variant="flush">
                    {dashboardData.ratingUsers.map((user, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col>
                            <strong>{user.name}</strong>
                            <br />
                            <small className="text-muted">{user.email}</small>
                            <br />
                            <small className="text-muted">{new Date(user.created_at).toLocaleDateString()}</small>
                          </Col>
                          <Col xs="auto">
                            <div>{renderStars(user.rating)}</div>
                            <div className="text-center">
                              <strong>{user.rating}/5</strong>
                            </div>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <div className="text-center p-4">
                    <h5>No ratings yet</h5>
                    <p>Encourage customers to rate your store!</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export default StoreOwnerDashboard
