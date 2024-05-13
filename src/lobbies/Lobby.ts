export class Lobby {
  private readonly MIN_PLAYERS = 2
  private readonly MAX_PLAYERS = 4

  public users: number[] = []

  constructor(public readonly code: string) {}

  public join(user: number) {
    if (this.users.length + 1 > this.MAX_PLAYERS) {
      throw new Error("La sala de juego está completa")
    }

    this.users.push(user)
  }

  public leave(user: number) {
    this.users = this.users.filter((u) => u !== user)
  }
}
