"use client"
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Layout = ({ children }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const getDashboardLink = () => {
    if (user?.role === "admin") {
      return "/admin/dashboard"
    } else if (user?.role === "store_owner") {
      return "/store-owner/dashboard"
    } else {
      return "/user/stores"
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">Store Rating App</Navbar.Brand>

          {user && (
            <>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                  <Nav.Link onClick={() => navigate(getDashboardLink())}>Home</Nav.Link>
                  <Nav.Link onClick={() => navigate("/update-password")}>Change Password</Nav.Link>
                  <NavDropdown title={user.name + " (" + user.role + ")"} id="user-dropdown">
                    <NavDropdown.Item onClick={() => navigate(getDashboardLink())}>Dashboard</NavDropdown.Item>
                    <NavDropdown.Item onClick={() => navigate("/update-password")}>Change Password</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </Navbar>

      <Container className="mt-4">{children}</Container>
    </div>
  )
}

export default Layout
