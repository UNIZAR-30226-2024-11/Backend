/**
 * @file Configuración de los canales de comunicación por sockets ofrecidos por el servidor
 * @author Dorian Wozniak <817570@unizar.es>
 */

import type { Socket } from "socket.io";

import { Game } from "../game";
import {
  createLobbyController,
  joinLobbyController,
  leaveLobbyController,
  playCardController,
  chooseCardColorController,
  startGameController,
} from "../controller";
import { Lobby } from "../lobbies/Lobby";
import { io } from "../config/server";

io.on("connect", (socket: Socket) => {
  console.log("Conexión establecida, ID:", socket.id);

  let state: {
    lobby: Lobby | null;
    game: Game | null;
    user: number | null;
    ioRoom: string | null;
  } = { lobby: null, game: null, user: null, ioRoom: null };

  socket.on(
    "create-lobby",
    (data) => (state = createLobbyController(socket, data, state)),
  );

  socket.on("join-lobby", (data) => {
    state = joinLobbyController(socket, data, state);
  });

  socket.on("leave-lobby", (data: {}) => {
    state = leaveLobbyController(socket, data, state);
  });

  socket.on("play-card", (data) => {
    state = playCardController(socket, data, state);
  });

  socket.on("choose-card-color", (data) => {
    state = chooseCardColorController(socket, data, state);
  });

  socket.on("start-game", (data: {}) => {
    state = startGameController(socket, data, state);
  });

  socket.on("disconnecting", (data: {}) => {
    state = leaveLobbyController(socket, data, state);
  });

  socket.on("disconnect", () => {
    console.log("Conexión perdida con el cliente", socket.id);
  });
});
