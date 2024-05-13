/**
 * @file Configuración de los canales de comunicación por sockets ofrecidos por el servidor
 * @author Dorian Wozniak <817570@unizar.es>
 */

import { join } from "path"
import { Lobby } from "../lobbies/Lobby"
import { LobbyManager } from "../lobbies/LobbyManager"
import type { Server, Socket } from "socket.io"

type CreateLobbyRequest = {
  user: number
}

type CreateLobbyResponse = {
  code: string
}

type JoinLobbyRequest = {
  user: number
  code: string
}

type JoinLobbyResponse = {
  code: string
}

type JoinLobbyEmit = {
  message: string
}

type LeaveLobbyEmit = {
  message: string
}

type ErrorResponse = {
  error: string
}

/**
 * Configura los eventos disponibles dado un servidor Socket.io
 *
 * @param io Servidor de Socket.io
 */
export const events = (io: Server) => {
  io.on("connect", (socket: Socket) => {
    console.log("Conexión establecida, ID:", socket.id)

    let myLobby: Lobby | null = null

    // NOTA: Sustituir por User
    let user: number | null = null

    let ioRoom: string | null = null

    socket.on("create-lobby", (data: CreateLobbyRequest) => {
      let res: CreateLobbyResponse | ErrorResponse

      if (!myLobby) {
        user = data.user

        myLobby = LobbyManager.createLobby()
        myLobby.join(user)

        ioRoom = `lobby-${myLobby.code}`

        socket.join(ioRoom)
        io.in(ioRoom).emit("user-joined-lobby", { message: `El usuario ${user} se ha unido a la sala` })
        console.log(socket.rooms)

        res = { code: myLobby.code }
        console.log(`El usuario ${user} ha creado la sala ${myLobby.code}`)
      } else {
        res = { error: "Ya estas en una sala" }
        console.log(`El usuario ${user} ya está en una sala`)
      }

      socket.emit("lobby-created", res)
    })

    socket.on("join-lobby", (data: JoinLobbyRequest) => {
      let res: JoinLobbyResponse | ErrorResponse

      if (!myLobby) {
        user = data.user

        try {
          myLobby = LobbyManager.joinLobby(user, data.code)
        } catch (err) {
          if (err instanceof Error) {
            res = { error: err.message }
            console.log(err.message)
          }
        } finally {
          if (myLobby) {
            ioRoom = `lobby-${myLobby.code}`
            socket.join(ioRoom)
            io.to(ioRoom).emit("user-joined-lobby", { message: `El usuario ${user} se ha unido a la sala` })
            res = { code: myLobby.code }
            console.log(`El usuario ${user} se ha unido a la sala ${myLobby.code}`)
          } else {
            res = { error: "No se ha podido unir a la sala" }
          }
        }
      } else {
        res = { error: "Ya estas en una sala" }
      }

      socket.emit("lobby-joined", res)
    })

    socket.on("leave-lobby", (data: {}) => {
      let res: {} | ErrorResponse

      if (myLobby) {
        myLobby.leave(user!)

        io.to(ioRoom!).emit("user-left-lobby", { message: `El usuario ${user} ha abandonado la sala` })

        socket.leave(ioRoom!)

        console.log(`El usuario ${user} ha abandonado la sala ${myLobby.code}`)

        myLobby = null
        ioRoom = null

        res = {}
      } else {
        res = { error: "No estas en una sala" }
      }

      socket.emit("lobby-left", res)
    })

    socket.on("disconnect", () => {
      if (myLobby) {
        myLobby.leave(user!)
        socket.leave(`lobby-${myLobby.code}`)
        myLobby = null
        ioRoom = null
      }

      console.log("Conexión perdida")
    })
  })
}
