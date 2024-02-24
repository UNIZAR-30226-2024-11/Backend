import { db } from "../database"

// NOTA: Alternativamente se podría implementar como una clase

export interface User {
  username: string
  email: string
  password: string
}

export const createUser = async (user: User) => {
  const query = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)"

  await db.query(query, [user.username, user.email, user.password])
}

export const findUserByEmail = async (email: string) => {
  const query = "SELECT DISTINCT * FROM users WHERE email = $1"

  try {
    const res = await db.query<User>(query, [email])

    if (res.rows.length === 0) {
      return null
    }

    return {
      username: res.rows[0].username,
      email: res.rows[0].email,
      password: res.rows[0].password,
    }
  } catch (err) {
    console.error(err)
    return null
  }
}

export const findUsersByUsernameOrEmail = async (username: string, email: string) => {
  const query = "SELECT DISTINCT * FROM users WHERE username = $1 OR email = $2"

  try {
    console.log("[findUsersByUsernameOrEmail] Buscando:", username, email)
    const res = await db.query<User>(query, [username, email])
    console.log("[findUsersByUsernameOrEmail] Encontrado:", res.rows)

    return res.rows.map(
      (user) =>
        ({
          username: user.username,
          email: user.email,
          password: user.password,
        }) as User,
    )
  } catch (err) {
    console.error(err)
    return null
  }
}
