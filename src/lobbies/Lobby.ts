export class Lobby {
  readonly MIN_USERS = 1
  readonly MIN_USERS_TO_START = 2
  readonly MAX_USERS = 4

  users: number[] = []

  constructor(readonly code: string) {}

  join(user_id: number) {
    if (this.users.length >= this.MAX_USERS) throw new Error("Lobby is full")
    else if (this.users.includes(user_id)) throw new Error("User already in lobby")
    else this.users.push(user_id)
  }

  leave(user_id: number): number {
    if (!this.users.includes(user_id)) throw new Error("User not in lobby")
    else this.users = this.users.filter((id) => id !== user_id)
    return this.users.length
  }
}
