import express from "express"
import { router } from "./api"
import { createServer } from "http"
import { Server } from "socket.io"

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
