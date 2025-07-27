"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Card, Form, Button, Modal } from "react-bootstrap"
import { storeAPI } from "../../services/api"
import Layout from "../../components/Layout"

const UserStores = () => {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchFilters, setSearchFilters] = useState({
    name: "",
    address: "",
    sortBy: "name",
    sortOrder: "ASC",
  })
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [selectedStore, setSelectedStore] = useState(null)

  useEffect(() => {
    loadStores()
  }, [searchFilters])

  const loadStores = async () => {
    try {
      const response = await storeAPI.getStores(searchFilters)
      setStores(response.data)
    } catch (error) {
      console.error("Error loading stores:", error)
      alert("Failed to load stores. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (e) => {
    setSearchFilters({
      ...searchFilters,
      [e.target.name]: e.target.value,
    })
  }

  const openRatingModal = (store) => {
    setSelectedStore(store)
    setShowRatingModal(true)
  }

  const closeRatingModal = () => {
    setShowRatingModal(false)
    setSelectedStore(null)
  }

  const submitRating = async (rating) => {
    try {
      await storeAPI.submitRating({
        storeId: selectedStore.id,
        rating: rating,
      })
      closeRatingModal()
      loadStores() // refresh the list
      const message = selectedStore.user_rating ? "Rating updated successfully!" : "Rating submitted successfully!"
      alert(message)
    } catch (error) {
      console.error("Error submitting rating:", error)
      alert("Failed to submit rating. Please try again.")
    }
  }

  // function to render star ratings
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? "#ffc107" : "#dee2e6", fontSize: "1.2rem" }}>
          ★
        </span>,
      )
    }
    return stars
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading stores...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Container>
        <h1 className="mb-4">All Stores</h1>

        {/* Search and Filter Section */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Search Stores</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Search by Store Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={searchFilters.name}
                    onChange={handleSearchChange}
                    placeholder="Type store name..."
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
                    onChange={handleSearchChange}
                    placeholder="Type address..."
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Sort By</Form.Label>
                  <Form.Select name="sortBy" value={searchFilters.sortBy} onChange={handleSearchChange}>
                    <option value="name">Store Name</option>
                    <option value="address">Address</option>
                    <option value="overall_rating">Rating</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Sort Order</Form.Label>
                  <Form.Select name="sortOrder" value={searchFilters.sortOrder} onChange={handleSearchChange}>
                    <option value="ASC">A to Z</option>
                    <option value="DESC">Z to A</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Row>
          {stores.map((store) => (
            <Col key={store.id} md={6} lg={4} className="mb-3">
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{store.name}</Card.Title>
                  <Card.Text className="text-muted">{store.address}</Card.Text>

                  <div className="mb-3">
                    <strong>Overall Rating:</strong>
                    <div className="mt-1">
                      {renderStars(Math.round(store.overall_rating))}
                      <span className="ms-2 text-muted">({Number.parseFloat(store.overall_rating).toFixed(1)})</span>
                    </div>
                  </div>

                  {store.user_rating && (
                    <div className="mb-3 p-2" style={{ backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
                      <strong>Your Rating:</strong>
                      <div className="mt-1">
                        {renderStars(store.user_rating)}
                        <span className="ms-2">({store.user_rating}/5)</span>
                      </div>
                    </div>
                  )}

                  <Button variant="primary" onClick={() => openRatingModal(store)} className="w-100">
                    {store.user_rating ? "Update My Rating" : "Rate This Store"}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {stores.length === 0 && (
          <div className="text-center mt-5">
            <h5 className="text-muted">No stores found matching your search.</h5>
            <p className="text-muted">Try adjusting your search criteria.</p>
          </div>
        )}

        <Modal show={showRatingModal} onHide={closeRatingModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedStore?.user_rating ? "Update Rating" : "Rate Store"}: {selectedStore?.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <p className="mb-4">Click on a star to {selectedStore?.user_rating ? "update" : "submit"} your rating:</p>
            <div className="mb-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <span
                  key={rating}
                  className="rating-stars-large mx-1"
                  style={{
                    color: rating <= (selectedStore?.user_rating || 0) ? "#ffc107" : "#dee2e6",
                    cursor: "pointer",
                  }}
                  onClick={() => submitRating(rating)}
                  onMouseEnter={(e) => (e.target.style.color = "#ffb300")}
                  onMouseLeave={(e) =>
                    (e.target.style.color = rating <= (selectedStore?.user_rating || 0) ? "#ffc107" : "#dee2e6")
                  }
                >
                  ★
                </span>
              ))}
            </div>
            {selectedStore?.user_rating && <p className="text-muted">Current rating: {selectedStore.user_rating}/5</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeRatingModal}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Layout>
  )
}

export default UserStores
