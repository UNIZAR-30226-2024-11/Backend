import { Lobby } from "../lobbies/Lobby"
import { Server, Socket } from "socket.io"

type ErrorResponse = {
  error: string
}

export const leaveLobbyController = (
  io: Server,
  socket: Socket,
  data: {},
  state: {
    lobby: Lobby | null
    user: number | null
    ioRoom: string | null
  },
): {
  lobby: Lobby | null
  user: number | null
  ioRoom: string | null
} => {
  let res: {} | ErrorResponse
  let { lobby, user, ioRoom } = state

  if (lobby) {
    lobby.leave(user!)

    io.to(ioRoom!).emit("user-left-lobby", { message: `El usuario ${user} ha abandonado la sala` })

    socket.leave(ioRoom!)

    console.log(`El usuario ${user} ha abandonado la sala ${lobby.code}`)

    lobby = null
    ioRoom = null

    res = {}
  } else {
    res = { error: "No estas en una sala" }
  }

  socket.emit("lobby-left", res)
  return { lobby, user, ioRoom }
}
