import bcrypt from "bcryptjs"
import { validationResult } from "express-validator"
import pool from "../config/database.js"

export const getDashboardStats = async (req, res) => {
  try {
    const [userCount] = await pool.execute("SELECT COUNT(*) as count FROM users")
    const [storeCount] = await pool.execute("SELECT COUNT(*) as count FROM stores")
    const [ratingCount] = await pool.execute("SELECT COUNT(*) as count FROM ratings")

    res.json({
      totalUsers: userCount[0].count,
      totalStores: storeCount[0].count,
      totalRatings: ratingCount[0].count,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const createUser = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password, address, role } = req.body

    const [existingUsers] = await pool.execute("SELECT id FROM users WHERE email = ?", [email])
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address, role],
    )

    res.status(201).json({ message: "User created successfully", userId: result.insertId })
  } catch (error) {
    console.error("Create user error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const createStore = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, address, ownerId } = req.body

    const [existingStores] = await pool.execute("SELECT id FROM stores WHERE email = ?", [email])
    if (existingStores.length > 0) {
      return res.status(400).json({ message: "Store already exists" })
    }

    if (ownerId) {
      const [ownerCheck] = await pool.execute("SELECT id, role FROM users WHERE id = ? AND role = 'store_owner'", [
        ownerId,
      ])
      if (ownerCheck.length === 0) {
        return res.status(400).json({ message: "Invalid owner ID or user is not a store owner" })
      }
    }

    const [result] = await pool.execute("INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)", [
      name,
      email,
      address,
      ownerId || null,
    ])

    res.status(201).json({ message: "Store created successfully", storeId: result.insertId })
  } catch (error) {
    console.error("Create store error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy = "name", sortOrder = "ASC" } = req.query

    let query = `
      SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
             COALESCE(AVG(r.rating), 0) as store_rating
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id AND u.role = 'store_owner'
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `
    const params = []

    if (name) {
      query += " AND u.name LIKE ?"
      params.push(`%${name}%`)
    }
    if (email) {
      query += " AND u.email LIKE ?"
      params.push(`%${email}%`)
    }
    if (address) {
      query += " AND u.address LIKE ?"
      params.push(`%${address}%`)
    }
    if (role) {
      query += " AND u.role = ?"
      params.push(role)
    }

    query += ` GROUP BY u.id, u.name, u.email, u.address, u.role, u.created_at`

    if (sortBy === "store_rating") {
      query += ` ORDER BY store_rating ${sortOrder}`
    } else {
      query += ` ORDER BY u.${sortBy} ${sortOrder}`
    }

    const [users] = await pool.execute(query, params)
    res.json(users)
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy = "name", sortOrder = "ASC" } = req.query

    let query = `
      SELECT s.id, s.name, s.email, s.address, s.created_at,
             COALESCE(AVG(r.rating), 0) as rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `
    const params = []

    if (name) {
      query += " AND s.name LIKE ?"
      params.push(`%${name}%`)
    }
    if (email) {
      query += " AND s.email LIKE ?"
      params.push(`%${email}%`)
    }
    if (address) {
      query += " AND s.address LIKE ?"
      params.push(`%${address}%`)
    }

    query += ` GROUP BY s.id, s.name, s.email, s.address, s.created_at`

    if (sortBy === "rating") {
      query += ` ORDER BY rating ${sortOrder}`
    } else {
      query += ` ORDER BY s.${sortBy} ${sortOrder}`
    }

    const [stores] = await pool.execute(query, params)
    res.json(stores)
  } catch (error) {
    console.error("Get stores error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
