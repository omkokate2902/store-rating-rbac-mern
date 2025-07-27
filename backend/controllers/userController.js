import pool from "../config/database.js"

export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params

    const query = `
      SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
             COALESCE(AVG(r.rating), 0) as store_rating,
             s.name as store_name, s.id as store_id
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id AND u.role = 'store_owner'
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE u.id = ?
      GROUP BY u.id
    `

    const [users] = await pool.execute(query, [userId])

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(users[0])
  } catch (error) {
    console.error("Get user details error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
