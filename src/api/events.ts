/**
 * @file Configuración de los canales de comunicación por sockets ofrecidos por el servidor
 * @author Dorian Wozniak <817570@unizar.es>
 */

import type { Server } from "socket.io"

// ! Esta ha sido la mejor manera que he encontrado para declarar los eventos.
// ! Si no, se le va la olla con los imports salvo que se meta import "./api/events"
// ! en el index.ts de src

/**
 * Configura los eventos disponibles dado un servidor Socket.io
 *
 * @param socket Servidor de Socket.io
 */
export const events = (socket: Server) => {
  socket.on("connect", (socket) => {
    console.log("Conexión establecida")

    socket.on("message", (message) => {
      console.log(`Mensaje recibido: ${message.body}`)
    })

    socket.on("disconnect", () => {
      console.log("Conexión perdida")
    })
  })
}
