import { Lobby } from "./Lobby"

export class LobbyManager {
  lobbies = new Map<string, Lobby>()

  /**
   * Crea un nueva sala de juego e introduce al usuario que la ha creado.
   *
   * @param user_id Identificador del usuario que crea la sala
   * @returns {string} Código de la sala creada
   */
  createLobby(): string {
    const code = this.generateCode()
    this.lobbies.set(code, new Lobby(code))

    console.log("Lobby created with code: " + code)
    return code
  }

  deleteLobby(code: string) {
    this.lobbies.delete(code)
    console.log("Lobby " + code + " deleted")
  }

  /**
   *
   *
   * @param code
   * @param user_id
   */
  joinLobby(code: string, user_id: number) {
    const lobby = this.lobbies.get(code)

    if (lobby) {
      lobby.join(user_id)
      console.log("User " + user_id + " joined lobby " + code)
    } else {
      throw new Error("Lobby not found")
    }
  }

  leaveLobby(code: string, user_id: number) {
    const lobby = this.lobbies.get(code)

    if (lobby) {
      const usersLeft = lobby.leave(user_id)
      console.log("User " + user_id + " left lobby " + code)

      if (usersLeft === 0) {
        this.lobbies.delete(code)
        console.log("Lobby " + code + " deleted")
      }
    } else {
      throw new Error("Lobby not found")
    }
  }

  /**
   * Devuelve un codigo único ue identifica una sala de juego.
   *
   * El código devuelto es
   *    - Único entre las salas activas
   *    - Alfanumérico (letras en minúscula y números)
   *    - De longitud 6
   *
   * @returns {string} Código de sala de juego
   */
  private generateCode(): string {
    const LENGTH = 6
    const ALPHABET = "abcdefghijklmnopqrstuvwxyz1234567890"
    let code = ""

    // Genera un código y comprueba que no exista ya
    do {
      for (let i = 0; i < LENGTH; i++) {
        code += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length))
      }
    } while (this.lobbies.has(code))

    return code
  }
}
