/**
 * @file Configuración de los canales de comunicación por sockets ofrecidos por el servidor
 * @author Dorian Wozniak <817570@unizar.es>
 */

import { createLobbyController, joinLobbyController, leaveLobbyController } from "../controller"
import { Lobby } from "../lobbies/Lobby"
import type { Server, Socket } from "socket.io"

/**
 * Configura los eventos disponibles dado un servidor Socket.io
 *
 * @param io Servidor de Socket.io
 */
export const events = (io: Server) => {
  io.on("connect", (socket: Socket) => {
    console.log("Conexión establecida, ID:", socket.id)

    let state: {
      lobby: Lobby | null
      user: number | null
      ioRoom: string | null
    } = { lobby: null, user: null, ioRoom: null }

    socket.on("create-lobby", (data) => (state = createLobbyController(io, socket, data, state)))

    socket.on("join-lobby", (data) => {
      state = joinLobbyController(io, socket, data, state)
    })

    socket.on("leave-lobby", (data: {}) => {
      state = leaveLobbyController(io, socket, data, state)
    })

    socket.on("disconnecting", (data: {}) => {
      state = leaveLobbyController(io, socket, data, state)
    })

    socket.on("disconnect", (data: {}) => {
      console.log("Conexión perdida con el cliente", socket.id)
    })
  })
}
