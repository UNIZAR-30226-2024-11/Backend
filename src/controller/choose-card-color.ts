import { CardColor, Game } from "../game";
import { Server, Socket } from "socket.io";

/**
 * Solicitud de elección de color de carta
 */
type ChooseCardColorRequest = {
  color: CardColor;
};

/**
 * Respuesta de error controlado
 */
type ErrorResponse = {
  error: string;
};

export const chooseCardColorController = (
  io: Server,
  socket: Socket,
  data: ChooseCardColorRequest,
  state: {
    lobby: any;
    game: Game | null;
    user: number | null;
    ioRoom: string | null;
  },
): {
  lobby: any;
  game: Game | null;
  user: number | null;
  ioRoom: string | null;
} => {
  let res: {} | ErrorResponse;
  const { lobby, game, user, ioRoom } = state;

  if (lobby && game) {
    const { color } = data;
    game.chooseColor(color);
    io.to(ioRoom!).emit("card-color-chosen", {
      message: `El usuario ${user} ha elegido el color ${color}`,
    });
    io.to(ioRoom!).emit("game-state", game.getState());
    res = {};
  } else {
    res = { error: "No estas en una sala o partida" };
  }

  socket.emit("card-color-chosen", res);
  return { lobby, game, user, ioRoom };
};
