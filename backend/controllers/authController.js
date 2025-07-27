import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import pool from "../config/database.js"

export const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password, address } = req.body

    const [existingUsers] = await pool.execute("SELECT id FROM users WHERE email = ?", [email])
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address, "user"],
    )

    res.status(201).json({ message: "User registered successfully", userId: result.insertId })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [email])
    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const user = users[0]

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    })

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const updatePassword = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { currentPassword, newPassword } = req.body
    const userId = req.user.id

    const isValidPassword = await bcrypt.compare(currentPassword, req.user.password)
    if (!isValidPassword) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await pool.execute("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId])

    res.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Update password error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
