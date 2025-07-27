import express from "express"
import { body } from "express-validator"
import { register, login, updatePassword } from "../controllers/authController.js"
import { authenticateToken } from "../middleware/auth.js"

const router = express.Router()

const registerValidation = [
  body("name").isLength({ min: 20, max: 60 }).withMessage("Name must be between 20 and 60 characters"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage("Password must contain at least one uppercase letter and one special character"),
  body("address").isLength({ max: 400 }).withMessage("Address must not exceed 400 characters"),
]

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
]

const updatePasswordValidation = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be between 8 and 16 characters")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .withMessage("Password must contain at least one uppercase letter and one special character"),
]

router.post("/register", registerValidation, register)
router.post("/login", loginValidation, login)
router.put("/update-password", authenticateToken, updatePasswordValidation, updatePassword)

export default router
