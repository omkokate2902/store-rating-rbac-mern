import express from "express"
import { body } from "express-validator"
import { getDashboardStats, createUser, createStore, getUsers, getStores } from "../controllers/adminController.js"
import { authenticateToken, requireRole } from "../middleware/auth.js"

const router = express.Router()

router.use(authenticateToken)
router.use(requireRole(["admin"]))

const createUserValidation = [
  body("name").isLength({ min: 20, max: 60 }).withMessage("Name must be between 20 and 60 characters"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage("Password must contain at least one uppercase letter and one special character"),
  body("address").isLength({ max: 400 }).withMessage("Address must not exceed 400 characters"),
  body("role").isIn(["admin", "user", "store_owner"]).withMessage("Invalid role"),
]

const createStoreValidation = [
  body("name").isLength({ min: 1, max: 60 }).withMessage("Store name must be between 1 and 60 characters"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("address").isLength({ max: 400 }).withMessage("Address must not exceed 400 characters"),
]

router.get("/dashboard", getDashboardStats)
router.post("/users", createUserValidation, createUser)
router.post("/stores", createStoreValidation, createStore)
router.get("/users", getUsers)
router.get("/stores", getStores)

export default router
