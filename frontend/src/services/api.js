import axios from "axios"

const API_BASE_URL = "http://localhost:4000/api"

const api = axios.create({
  baseURL: API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  updatePassword: (passwordData) => api.put("/auth/update-password", passwordData),
}

export const adminAPI = {
  getDashboardStats: () => api.get("/admin/dashboard"),
  createUser: (userData) => api.post("/admin/users", userData),
  createStore: (storeData) => api.post("/admin/stores", storeData),
  getUsers: (params) => api.get("/admin/users", { params }),
  getStores: (params) => api.get("/admin/stores", { params }),
  getUserDetails: (userId) => api.get(`/users/${userId}`),
}

export const storeAPI = {
  getStores: (params) => api.get("/stores", { params }),
  submitRating: (ratingData) => api.post("/stores/rate", ratingData),
  getOwnerDashboard: () => api.get("/stores/owner-dashboard"),
}

export default api
