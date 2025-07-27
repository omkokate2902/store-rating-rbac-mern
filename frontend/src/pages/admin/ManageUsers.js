"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, Table, Badge, Button } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { adminAPI } from "../../services/api"
import Layout from "../../components/Layout"

const ManageUsers = () => {
  const [usersList, setUsersList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchFilters, setSearchFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
    sortBy: "name",
    sortOrder: "ASC",
  })

  const navigate = useNavigate()

  const showStars = (rating) => {
    const numRating = Number.parseFloat(rating) || 0
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= Math.round(numRating) ? "#ffc107" : "#dee2e6" }}>
          ★
        </span>,
      )
    }
    return stars
  }

  useEffect(() => {
    loadUsers()
  }, [searchFilters])

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getUsers(searchFilters)
      setUsersList(response.data)
    } catch (error) {
      console.error("Error loading users:", error)
      alert("Failed to load users. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setSearchFilters({
      ...searchFilters,
      [e.target.name]: e.target.value,
    })
  }

  const handleColumnSort = (column) => {
    setSearchFilters({
      ...searchFilters,
      sortBy: column,
      sortOrder: searchFilters.sortBy === column && searchFilters.sortOrder === "ASC" ? "DESC" : "ASC",
    })
  }

  const getRoleBadgeColor = (role) => {
    if (role === "admin") {
      return "danger"
    } else if (role === "store_owner") {
      return "warning"
    } else {
      return "primary"
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading users...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Manage Users</h1>
          <Button as={Link} to="/admin/create-user" variant="primary">
            Add New User
          </Button>
        </div>

        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Search & Filter Users</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Search by Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={searchFilters.name}
                    onChange={handleFilterChange}
                    placeholder="Type name..."
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Search by Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={searchFilters.email}
                    onChange={handleFilterChange}
                    placeholder="Type email..."
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Search by Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={searchFilters.address}
                    onChange={handleFilterChange}
                    placeholder="Type address..."
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Filter by Role</Form.Label>
                  <Form.Select name="role" value={searchFilters.role} onChange={handleFilterChange}>
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="store_owner">Store Owner</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h5 className="mb-0">All Users ({usersList.length} found)</h5>
          </Card.Header>
          <Card.Body className="p-0">
            {usersList.length > 0 ? (
              <Table striped hover responsive>
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th className="sortable-header" onClick={() => handleColumnSort("name")}>
                      Name {searchFilters.sortBy === "name" ? (searchFilters.sortOrder === "ASC" ? "↑" : "↓") : ""}
                    </th>
                    <th className="sortable-header" onClick={() => handleColumnSort("email")}>
                      Email {searchFilters.sortBy === "email" ? (searchFilters.sortOrder === "ASC" ? "↑" : "↓") : ""}
                    </th>
                    <th>Address</th>
                    <th>Role</th>
                    <th>Store Rating</th>
                    <th>Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.id}</strong>
                      </td>
                      <td>
                        <Button
                          variant="link"
                          className="p-0 text-start"
                          onClick={() => navigate(`/admin/users/${user.id}`)}
                        >
                          {user.name}
                        </Button>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <small>
                          {user.address
                            ? user.address.length > 30
                              ? user.address.substring(0, 30) + "..."
                              : user.address
                            : "Not provided"}
                        </small>
                      </td>
                      <td>
                        <Badge bg={getRoleBadgeColor(user.role)}>{user.role.replace("_", " ")}</Badge>
                      </td>
                      <td>
                        {user.role === "store_owner" ? (
                          <div>
                            {showStars(user.store_rating || 0)}
                            <br />
                            <small className="text-muted">
                              ({Number.parseFloat(user.store_rating || 0).toFixed(1)})
                            </small>
                          </div>
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                      <td>
                        <small className="text-muted">{new Date(user.created_at).toLocaleDateString()}</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center p-5">
                <h5 className="text-muted">No users found matching your search criteria</h5>
                <Button as={Link} to="/admin/create-user" variant="primary" className="mt-3">
                  Create First User
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </Layout>
  )
}

export default ManageUsers
