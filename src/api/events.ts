/**
 * @file Configuración de los canales de comunicación por sockets ofrecidos por el servidor
 * @author Dorian Wozniak <817570@unizar.es>
 */

import { io } from "config/io"
import type { Server, Socket } from "socket.io"

// ! Esta ha sido la mejor manera que he encontrado para declarar los eventos.
// ! Si no, se le va la olla con los imports salvo que se meta import "./api/events"
// ! en el index.ts de src

const createLobbyController = (socket: Socket) => {
  const code = "123456"

  socket.join(`lobby-${code}`)
  socket.emit("lobby-created", {
    message: `Lobby ${code} created`,
    code: code,
  })
}

const joinLobbyController = async (socket: Socket, data: { code: string }) => {
  const code = data.code
}

/**
 * Configura los eventos disponibles dado un servidor Socket.io
 *
 * @param io Servidor de Socket.io
 */
export const events = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    const host = socket.handshake.headers.host

    console.log(`Conexión establecida: ${host}`)

    socket.on("create-lobby", createLobbyController)

    socket.on("join-lobby", joinLobbyController)

    io.on("disconnect", () => {
      console.log(`Conexión perdida: ${host}`)
    })
  })
}
