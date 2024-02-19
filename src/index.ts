import express from "express"
import { router } from "./api"
import { createServer } from "http"
import { Server } from "socket.io"

import { Pool } from "pg"

const PORT = Number(process.env.PORT) || 8000

const app = express()
app.use("/api", router)

const httpServer = createServer(app)

const io = new Server(httpServer, {
  cors: { origin: "*" },
})

io.on("connection", (socket) => {
  console.log("A user connected")

  socket.on("message", (message) => {
    console.log("Message received:", message.body)
    io.emit("message", message)
  })

  socket.on("disconnect", () => {
    console.log("A user disconnected")
  })
})

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// Base de datos (se puede usar Docker o tenerla instalada localmente)
const db = new Pool({
  user: "graham",
  host: "10.5.0.3",
  database: "graham-uno-dev",
  password: "password",
  port: 5432,
})

// Como no tiene tablas creadas, solo se verifica la conexión
db.query("SELECT version()", (err, res) => {
  if (err) {
    console.error(err)
  } else {
    console.log(res.rows[0].version)
  }
})

db.end()
