import { Game, Card } from "../game";
import { Lobby } from "../lobbies/Lobby";
import { Server, Socket } from "socket.io";

/**
 * Solicitud de jugar una carta
 */
type PlayCardRequest = {
  card: Card;
};

/**
 * Respuesta de error controlado
 */
type ErrorResponse = {
  error: string;
};

export const playCardController = (
  io: Server,
  socket: Socket,
  data: PlayCardRequest,
  state: {
    lobby: Lobby | null;
    game: Game | null;
    user: number | null;
    ioRoom: string | null;
  },
): {
  lobby: Lobby | null;
  game: Game | null;
  user: number | null;
  ioRoom: string | null;
} => {
  let res: {} | ErrorResponse;
  const { lobby, game, user, ioRoom } = state;

  if (lobby && game) {
    const { card } = data;
    if (game.canPlayCard(card)) {
      game.playCard(user!, card);
      io.to(ioRoom!).emit("card-played", {
        message: `El usuario ${user} ha jugado la carta ${card}`,
      });
      io.to(ioRoom!).emit("game-state", game.getState());
      res = {};
    } else {
      res = { error: "No puedes jugar esa carta" };
    }
  } else {
    res = { error: "No estas en una sala o partida" };
  }

  socket.emit("card-played", res);
  return { lobby, game, user, ioRoom };
};
