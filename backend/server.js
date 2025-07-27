import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.js"
import adminRoutes from "./routes/admin.js"
import storeRoutes from "./routes/stores.js"
import userRoutes from "./routes/users.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/stores", storeRoutes)
app.use("/api/users", userRoutes)

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!" })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
