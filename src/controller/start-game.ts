import { Game } from "game";
import { Lobby } from "../lobbies/Lobby";
import { Server, Socket } from "socket.io";

/**
 * Respuesta de error controlado
 */
type ErrorResponse = {
  error: string
}

export const startGameController = (
  io: Server,
  socket: Socket,
  data: {},
  state: {
    lobby: Lobby | null
    game: Game | null
    user: number | null
    ioRoom: string | null
  },
): {
  lobby: Lobby | null
  game: Game | null
  user: number | null
  ioRoom: string | null
} => {
  let res: {} | ErrorResponse
  let { lobby, game, user, ioRoom } = state

  if (lobby) {
    game = new Game()
    game.start()
    io.to(ioRoom!).emit("game-started", { message: `La partida ha comenzado` })
    io.to(ioRoom!).emit("game-state", game.getState())
    res = {}
  } else {
    res = { error: "No estas en una sala o la partida ya ha comenzado" }
  }

  socket.emit("game-started", res)
  return { lobby, game, user, ioRoom }
}