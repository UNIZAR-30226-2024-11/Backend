import { Server } from "socket.io"

import { Lobby } from "./Lobby"

export class LobbyManager {
  private readonly lobbies: Map<string, Lobby> = new Map()

  constructor() {}

  public createLobby() {
    const lobby = new Lobby(this.generateCode())
  }

  public joinLobby(code: string) {
    const lobby = this.lobbies.get(code)

    if (lobby) lobby.join()
    else console.error("Lobby no encontrado")
  }

  /**
   * Genera un código de seis caracteres alfanuméricos para identificar la sala
   *
   * @returns Código de sala válido
   */
  private generateCode(): string {
    let code: string

    do {
      code = Math.random().toString(36).substring(2, 8)
    } while (this.lobbies.has(code))

    return code
  }
}
