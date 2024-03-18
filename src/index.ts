/**
 * @file Punto de entrada de la aplicación
 */

import { server } from "./config"

const PORT = Number(process.env.PORT) || 8000

// Lanza el servidor
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

// import repl from "node:repl"
// import { LobbyManager } from "./lobbies/LobbyManager"

// const lm = new LobbyManager()

// const lobby1 = lm.createLobby()

// lm.joinLobby(lobby1, 1)
// lm.joinLobby(lobby1, 2)
// lm.joinLobby(lobby1, 3)
// lm.joinLobby(lobby1, 4)

// lm.leaveLobby(lobby1, 2)
// lm.leaveLobby(lobby1, 3)
// lm.leaveLobby(lobby1, 4)
// lm.leaveLobby(lobby1, 1)

// // Continua con un REPL
// repl.start()
