import { Lobby } from "./Lobby";
import { LobbyManager } from "./LobbyManager";

import { Socket } from "socket.io";

/**
 * Respuesta de creación de una sala nueva
 */
type CreateLobbyResponse = {
  code: string;
};

/**
 * Respuesta de error controlado
 */
type ErrorResponse = {
  error: string;
};

export const createLobbyController = (
  socket: Socket,
  data: {},
  state: {
    lobby: Lobby | null;
    game: any;
    user: number | null;
    ioRoom: string | null;
  },
): {
  lobby: Lobby | null;
  game: null;
  user: number | null;
  ioRoom: string | null;
} => {
  let res: CreateLobbyResponse | ErrorResponse;

  const { lobby, game, user, ioRoom } = state;

  if (!lobby) {
    const thisLobby = LobbyManager.createLobby();
    res = { code: thisLobby.code };
  } else {
    res = { error: "Ya estas en una sala" };
    console.log(`El usuario ${user} ya está en una sala`);
  }

  socket.emit("lobby-created", res);

  return { lobby, game, user, ioRoom };
};
