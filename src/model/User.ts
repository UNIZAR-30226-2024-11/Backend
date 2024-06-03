/**
 * @file Modelo y controlador para el manejo de usuarios en la base de datos
 * @author Dorian Wozniak <817570@unizar.es>
 */

import { db } from "../config";

// TODO: Una mejor forma de tratar erorres de DB usando pg.DatabaseError

const CREATE_QUERY = `
  INSERT INTO users (username, email, password)
  VALUES ($1, $2, $3)
  `;

const FIND_BY_EMAIL_QUERY = `
  SELECT DISTINCT *
  FROM users
  WHERE email = $1`;

const FIND_BY_USERNAME_OR_EMAIL_QUERY = `
  SELECT DISTINCT *
  FROM users
  WHERE username = $1 OR email = $2`;

  const FIND_USER_DATA_BY_ID_QUERY = `
  SELECT id, username, email, games_won, coins
  FROM users
  WHERE id = $1
`;

const UPDATE_USER_COINS_QUERY = `
  UPDATE users
  SET coins = $1
  WHERE id = $2
`;



/** User representa un usuario registrado dentro del sistema. */
export interface User {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
  level?: number;
  games_won?: number;
  coins?: number;
}

/**
 * Añade un nuevo usuario dentro de la base de datos.
 *
 * @param user Usuario a añadir
 */
export const createUser = async (
  username: string,
  email: string,
  password: string,
) => {
  return await db.query<User>(CREATE_QUERY, [username, email, password]);
};

/**
 * Devuelve el primer usuario que coincida con el email dado.
 *
 * @param email Email del usuario a buscar
 * @returns Primer usuario encontrado
 */
export const findUserByEmail = async (email: string) => {
  const res = await db.query<User>(FIND_BY_EMAIL_QUERY, [email]);

  if (res.rows.length > 0) return res.rows[0];
};

/**
 * Devuelve una lista de usuarios que coincidan con el nombre de usuario o email dados.
 *
 * @param username Nombre de usuario
 * @param email Email del usuario
 * @returns Lista de usuarios encontrados
 */
export const findUsersByUsernameOrEmail = async (
  username: string,
  email: string,
) => {
  const res = await db.query<User>(FIND_BY_USERNAME_OR_EMAIL_QUERY, [
    username,
    email,
  ]);

  return res.rows;
};

/**
 * Devuelve las monedas y las partidas ganadas de un jugador
 *
 * @param id Id de usuario
 * @returns Monedas y partidas ganadas
 */
export const findUserDataById = async (id: number) => {
  const res = await db.query(FIND_USER_DATA_BY_ID_QUERY, [id]);
  if (res.rows.length > 0) {
    return res.rows[0] as User;
  }
  return null;
};

export const updateUserCoins = async (id: number, coins: number) => {
  const res = await db.query(UPDATE_USER_COINS_QUERY, [coins, id]);
  if (res.rows.length > 0) {
    return res.rows[0]; // Devuelve el objeto actualizado
  }
  return null; // Devuelve null si no se encuentra el usuario
};