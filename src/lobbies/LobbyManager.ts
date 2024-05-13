import { Lobby } from "./Lobby"

/**
 * Clase gestora de salas de juego
 */
export class LobbyManager {
  private static lobbies = new Map<string, Lobby>()

  /**
   * Crea una nueva sala de juego
   *
   * @returns ID de sala
   */
  public static createLobby(): Lobby {
    const code = this.generateCode()
    const lobby = new Lobby(code)

    this.lobbies.set(code, lobby)

    return lobby
  }

  /**
   * Elimina una sala de juego
   *
   * @param id ID de sala
   */
  public static deleteLobby(id: string) {
    this.lobbies.delete(id)
  }

  /**
   * Añade a un usuario a una sala de juego
   *
   * @param user ID de usuario a añadir
   * @param id ID de sala
   */
  public static joinLobby(user: number, id: string): Lobby | null {
    const lobby = this.lobbies.get(id)

    if (lobby) {
      lobby.join(user)
    } else {
      throw new Error("No se ha encontrado la sala de juego")
    }

    return lobby
  }

  /**
   * Saca a un usuario de una sala de juego
   *
   * @param user
   * @param id
   */
  public static leaveLobby(user: number, id: string) {
    const lobby = this.lobbies.get(id)

    if (lobby) {
      lobby.leave(user)

      if (lobby.users.length === 0) {
        this.deleteLobby(id)
      }
    } else {
      throw new Error("No se ha encontrado la sala de juego")
    }
  }

  /**
   * Devuelve un codigo único que identifica una sala de juego.
   *
   * El código devuelto es
   *    - Único entre las salas activas
   *    - Alfanumérico (letras en minúscula y números)
   *    - De longitud 6
   *
   * @returns {string} Código de sala de juego
   */
  private static generateCode(): string {
    const LENGTH = 6
    const ALPHABET = "abcdefghijklmnopqrstuvwxyz1234567890"
    let code = ""

    do {
      for (let i = 0; i < LENGTH; i++) {
        code += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length))
      }
    } while (this.lobbies.has(code))

    return code
  }
}
