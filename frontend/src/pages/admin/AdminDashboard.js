"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { adminAPI } from "../../services/api"
import Layout from "../../components/Layout"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboardStats()
      setStats(response.data)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container>
        <h1 className="mb-4">Admin Dashboard</h1>

        <Row className="mb-4">
          <Col md={4}>
            <Card className="mb-3 text-center">
              <Card.Body>
                <h5 className="card-title">Total Users</h5>
                <h2 className="text-primary">{stats.totalUsers}</h2>
                <p className="text-muted">Registered users</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-3 text-center">
              <Card.Body>
                <h5 className="card-title">Total Stores</h5>
                <h2 className="text-success">{stats.totalStores}</h2>
                <p className="text-muted">Registered stores</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-3 text-center">
              <Card.Body>
                <h5 className="card-title">Total Ratings</h5>
                <h2 className="text-warning">{stats.totalRatings}</h2>
                <p className="text-muted">Submitted ratings</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={6} className="mb-3">
            <Card>
              <Card.Body>
                <h5 className="card-title">User Management</h5>
                <p className="card-text">Add new users and manage existing ones</p>
                <Button as={Link} to="/admin/create-user" variant="primary" className="me-2">
                  Add New User
                </Button>
                <Button as={Link} to="/admin/users" variant="outline-primary">
                  View All Users
                </Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-3">
            <Card>
              <Card.Body>
                <h5 className="card-title">Store Management</h5>
                <p className="card-text">Add new stores and manage existing ones</p>
                <Button as={Link} to="/admin/create-store" variant="success" className="me-2">
                  Add New Store
                </Button>
                <Button as={Link} to="/admin/stores" variant="outline-success">
                  View All Stores
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}

export default AdminDashboard
