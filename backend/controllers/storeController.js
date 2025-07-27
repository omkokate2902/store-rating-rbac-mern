import pool from "../config/database.js"

export const getStores = async (req, res) => {
  try {
    const { name, address, sortBy = "name", sortOrder = "ASC" } = req.query
    const userId = req.user.id

    let query = `
      SELECT s.id, s.name, s.address, s.created_at,
             COALESCE(AVG(r.rating), 0) as overall_rating,
             MAX(CASE WHEN ur.user_id = ? THEN ur.rating END) as user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id
      WHERE 1=1
    `
    const params = [userId]

    if (name) {
      query += " AND s.name LIKE ?"
      params.push(`%${name}%`)
    }
    if (address) {
      query += " AND s.address LIKE ?"
      params.push(`%${address}%`)
    }

    query += ` GROUP BY s.id, s.name, s.address, s.created_at`

    if (sortBy === "overall_rating") {
      query += ` ORDER BY overall_rating ${sortOrder}`
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

export const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body
    const userId = req.user.id

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" })
    }

    const [stores] = await pool.execute("SELECT id FROM stores WHERE id = ?", [storeId])
    if (stores.length === 0) {
      return res.status(404).json({ message: "Store not found" })
    }

    await pool.execute(
      `INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), updated_at = CURRENT_TIMESTAMP`,
      [userId, storeId, rating],
    )

    res.json({ message: "Rating submitted successfully" })
  } catch (error) {
    console.error("Submit rating error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getStoreOwnerDashboard = async (req, res) => {
  try {
    const userId = req.user.id

    const [stores] = await pool.execute("SELECT id, name FROM stores WHERE owner_id = ?", [userId])

    if (stores.length === 0) {
      return res.status(404).json({ message: "No store found for this owner" })
    }

    const store = stores[0]

    const [avgRating] = await pool.execute(
      "SELECT COALESCE(AVG(rating), 0) as average_rating FROM ratings WHERE store_id = ?",
      [store.id],
    )

    const [ratingUsers] = await pool.execute(
      `
      SELECT u.name, u.email, r.rating, r.created_at
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
      ORDER BY r.created_at DESC
    `,
      [store.id],
    )

    res.json({
      store: store,
      averageRating: Number.parseFloat(avgRating[0].average_rating).toFixed(1),
      ratingUsers: ratingUsers,
    })
  } catch (error) {
    console.error("Store owner dashboard error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
