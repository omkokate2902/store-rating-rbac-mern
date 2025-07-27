"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, Table, Button } from "react-bootstrap"
import { Link } from "react-router-dom"
import { adminAPI } from "../../services/api"
import Layout from "../../components/Layout"

const ManageStores = () => {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    sortBy: "name",
    sortOrder: "ASC",
  })

  useEffect(() => {
    fetchStores()
  }, [filters])

  const fetchStores = async () => {
    try {
      const response = await adminAPI.getStores(filters)
      setStores(response.data)
    } catch (error) {
      console.error("Error fetching stores:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    })
  }

  const handleSort = (field) => {
    setFilters({
      ...filters,
      sortBy: field,
      sortOrder: filters.sortBy === field && filters.sortOrder === "ASC" ? "DESC" : "ASC",
    })
  }

  const getSortIcon = (field) => {
    if (filters.sortBy !== field) return "↕️"
    return filters.sortOrder === "ASC" ? "↑" : "↓"
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

  return (
    <Layout>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-6 fw-bold text-dark">Manage Stores</h1>
          <Button as={Link} to="/admin/create-store" variant="primary">
            Add New Store
          </Button>
        </div>

        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Filters</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Search by Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleFilterChange}
                    placeholder="Enter store name..."
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Search by Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={filters.email}
                    onChange={handleFilterChange}
                    placeholder="Enter store email..."
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Search by Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={filters.address}
                    onChange={handleFilterChange}
                    placeholder="Enter address..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h5 className="mb-0">Stores ({stores.length})</h5>
          </Card.Header>
          <Card.Body className="p-0">
            {stores.length > 0 ? (
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th className="sortable-header" onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                        Store Name {getSortIcon("name")}
                      </th>
                      <th className="sortable-header" onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                        Email {getSortIcon("email")}
                      </th>
                      <th>Address</th>
                      <th
                        className="sortable-header"
                        onClick={() => handleSort("rating")}
                        style={{ cursor: "pointer" }}
                      >
                        Rating {getSortIcon("rating")}
                      </th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stores.map((store) => (
                      <tr key={store.id}>
                        <td className="fw-bold">{store.id}</td>
                        <td>{store.name}</td>
                        <td>{store.email}</td>
                        <td>
                          <small className="text-muted">
                            {store.address
                              ? store.address.length > 50
                                ? store.address.substring(0, 50) + "..."
                                : store.address
                              : "N/A"}
                          </small>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            {renderStars(store.rating)}
                            <span className="ms-2 small text-muted">
                              ({Number.parseFloat(store.rating || 0).toFixed(1)})
                            </span>
                          </div>
                        </td>
                        <td>
                          <small className="text-muted">{new Date(store.created_at).toLocaleDateString()}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-5">
                <h5 className="text-muted">No stores found matching your criteria</h5>
                <Button as={Link} to="/admin/create-store" variant="primary" className="mt-2">
                  Create First Store
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  )
}

export default ManageStores
