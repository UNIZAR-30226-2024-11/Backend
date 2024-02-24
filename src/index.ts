import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"

import { router } from "./api"
import bodyParser from "body-parser"
import cors from "cors"

const PORT = Number(process.env.PORT) || 8000

// Servidor HTTP
const app = express()
app.use(bodyParser.json())
app.use(cors())

// TODO: Mover esto a otro lado
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.message)
  res.status(500).json({ error: "Error interno" })
}

app.use(errorHandler)

app.use("/api", router)

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
