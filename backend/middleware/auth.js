import jwt from "jsonwebtoken"
import pool from "../config/database.js"

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Access token required" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const [users] = await pool.execute("SELECT * FROM users WHERE id = ?", [decoded.userId])

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid token" })
    }

    req.user = users[0]
    next()
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" })
  }
}

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" })
    }
    next()
  }
}
