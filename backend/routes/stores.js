import express from "express"
import { body } from "express-validator"
import { getStores, submitRating, getStoreOwnerDashboard } from "../controllers/storeController.js"
import { authenticateToken, requireRole } from "../middleware/auth.js"

const router = express.Router()

router.use(authenticateToken)

const ratingValidation = [
  body("storeId").isInt({ min: 1 }).withMessage("Valid store ID is required"),
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
]

router.get("/", getStores)
router.post("/rate", ratingValidation, submitRating)
router.get("/owner-dashboard", requireRole(["store_owner"]), getStoreOwnerDashboard)

export default router
