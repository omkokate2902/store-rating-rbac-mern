import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

import Login from "./pages/Login"
import Register from "./pages/Register"
import UpdatePassword from "./pages/UpdatePassword"

import AdminDashboard from "./pages/admin/AdminDashboard"
import CreateUser from "./pages/admin/CreateUser"
import CreateStore from "./pages/admin/CreateStore"
import ManageUsers from "./pages/admin/ManageUsers"
import ManageStores from "./pages/admin/ManageStores"
import UserDetails from "./pages/admin/UserDetails"

import UserStores from "./pages/user/UserStores"

import StoreOwnerDashboard from "./pages/store-owner/StoreOwnerDashboard"

import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/update-password"
              element={
                <ProtectedRoute>
                  <UpdatePassword />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/create-user"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CreateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/create-store"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <CreateStore />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/stores"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ManageStores />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:userId"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UserDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user/stores"
              element={
                <ProtectedRoute allowedRoles={["user"]}>
                  <UserStores />
                </ProtectedRoute>
              }
            />

            <Route
              path="/store-owner/dashboard"
              element={
                <ProtectedRoute allowedRoles={["store_owner"]}>
                  <StoreOwnerDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route
              path="/unauthorized"
              element={
                <div className="min-vh-100 d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <h1 className="display-4 text-danger">Unauthorized</h1>
                    <p className="lead text-muted">You don't have permission to access this page.</p>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
