import { Lobby } from "../lobbies/Lobby"
import { LobbyManager } from "../lobbies/LobbyManager"
import { Server, Socket } from "socket.io"

type CreateLobbyRequest = {
  user: number
}

type CreateLobbyResponse = {
  code: string
}

type ErrorResponse = {
  error: string
}

export const createLobbyController = (
  io: Server,
  socket: Socket,
  data: CreateLobbyRequest,
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
  let res: CreateLobbyResponse | ErrorResponse

  let { lobby, user, ioRoom } = state

  if (!lobby) {
    user = data.user
    lobby = LobbyManager.createLobby()
    res = { code: lobby.code }

    console.log(`El usuario ${user} ha creado la sala ${lobby.code}`)
  } else {
    res = { error: "Ya estas en una sala" }
    console.log(`El usuario ${user} ya está en una sala`)
  }

  socket.emit("lobby-created", res)

  return { lobby, user, ioRoom }
}
