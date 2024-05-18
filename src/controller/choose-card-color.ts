import { Socket } from "socket.io";

import { CardColor, Game } from "../game";
import { io } from "../config/server";

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
