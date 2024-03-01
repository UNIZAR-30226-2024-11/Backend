import { db } from "../config"

// TODO: Una mejor forma de tratar erorres de DB usando pg.DatabaseError

const CREATE_QUERY = `
  INSERT INTO users (username, email, password)
  VALUES ($1, $2, $3)
  `

const FIND_BY_EMAIL_QUERY = `
  SELECT DISTINCT *
  FROM users
  WHERE email = $1`

const FIND_BY_USERNAME_OR_EMAIL_QUERY = `
  SELECT DISTINCT *
  FROM users
  WHERE username = $1 OR email = $2`

/**
 * User representa un usuario registrado dentro del sistema.
 */
export interface User {
  id?: number
  username?: string
  email?: string
  password?: string
}

/**
 * Añade un nuevo usuario dentro de la base de datos.
 *
 * @param user Usuario a añadir
 */
export const createUser = async (username: string, email: string, password: string) => {
  return await db.query<User>(CREATE_QUERY, [username, email, password])
}

/**
 * Devuelve el primer usuario que coincida con el email dado.
 *
 * @param email Email del usuario a buscar
 * @returns Primer usuario encontrado
 */
export const findUserByEmail = async (email: string) => {
  const res = await db.query<User>(FIND_BY_EMAIL_QUERY, [email])

  if (res.rows.length > 0) return res.rows[0]
}

/**
 * Devuelve una lista de usuarios que coincidan con el nombre de usuario o email dados.
 *
 * @param username Nombre de usuario
 * @param email Email del usuario
 * @returns Lista de usuarios encontrados
 */
export const findUsersByUsernameOrEmail = async (username: string, email: string) => {
  const res = await db.query<User>(FIND_BY_USERNAME_OR_EMAIL_QUERY, [username, email])

  return res.rows
}
