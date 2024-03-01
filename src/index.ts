import { createServer } from "http"
import { Server } from "socket.io"

import { app } from "./config"

const PORT = Number(process.env.PORT) || 8000

const httpServer = createServer(app)

// Servidor WebSocket
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

// Lanza el servidor
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
