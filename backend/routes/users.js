import express from "express"
import { getUserDetails } from "../controllers/userController.js"
import { authenticateToken, requireRole } from "../middleware/auth.js"

const router = express.Router()

router.use(authenticateToken)

router.get("/:userId", requireRole(["admin"]), getUserDetails)

export default router
