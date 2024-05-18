import { Lobby } from "../lobbies/Lobby";
import { LobbyManager } from "../lobbies/LobbyManager";
import { Server, Socket } from "socket.io";

/**
 * Solicitud de unirse a una sala
 */
type JoinLobbyRequest = {
  user: number;
  code: string;
};

/**
 * Respuesta de unirse a una sala
 */
type JoinLobbyResponse = {
  code: string;
};

/**
 * Respuesta de error controlado
 */
type ErrorResponse = {
  error: string;
};

export const joinLobbyController = (
  io: Server,
  socket: Socket,
  data: JoinLobbyRequest,
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
  let res: JoinLobbyResponse | ErrorResponse;
  let { lobby, game, user, ioRoom } = state;

  if (!lobby) {
    user = data.user;

    try {
      lobby = LobbyManager.joinLobby(user, data.code);
    } catch (err) {
      if (err instanceof Error) {
        res = { error: err.message };
        console.log(err.message);
      }
    } finally {
      if (lobby) {
        ioRoom = `lobby-${lobby.code}`;
        socket.join(ioRoom);
        io.to(ioRoom).emit("user-joined-lobby", {
          message: `El usuario ${user} se ha unido a la sala`,
        });
        res = { code: lobby.code };
        console.log(`El usuario ${user} se ha unido a la sala ${lobby.code}`);
      } else {
        res = { error: "No se ha podido unir a la sala" };
      }
    }
  } else {
    res = { error: "Ya estas en una sala" };
  }

  socket.emit("lobby-joined", res);
  return { lobby, game, user, ioRoom };
};
