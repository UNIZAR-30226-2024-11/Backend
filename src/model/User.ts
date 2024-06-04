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
  SELECT DISTINCT *
  FROM users
  WHERE id = $1
`;

const UPDATE_USER_COINS_QUERY = `
  UPDATE users
  SET coins = $1
  WHERE id = $2
`;

const UPDATE_USER_LEVEL_QUERY = `
  UPDATE users
  SET level = $1
  WHERE id = $2
`;

const UPDATE_USER_GAMES_WON_QUERY = `
  UPDATE users
  SET games_won = $1
  WHERE id = $2
`;

const UPDATE_USER_AVATAR_QUERY = `
  UPDATE users
  SET avatar = $1
  WHERE id = $2
`;

const ADD_USER_FRIEND_QUERY = `
  UPDATE users
  SET friends = array_append(friends, $1)
  WHERE id = $2
`;

const ADD_USER_FRIEND_REQUEST_QUERY = `
  UPDATE users
  SET friend_requests = array_append(friend_requests, $1)
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
  games_played?: number;
  coins?: number;
  friends?: string[];
  friend_requests?: string[];
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
 * Devuelve los datos de un usuario por su id.
 *
 * @param id Id de usuario
 * @returns Datos del usuario o null
 */
export const findUserDataById = async (id: number) => {
  const res = await db.query<User>(FIND_USER_DATA_BY_ID_QUERY, [id]);
  if (res.rows.length > 0) {
    return res.rows[0];
  }
};

/**
 * Actualiza las monedas de un usuario
 *
 * @param id Id de usuario
 * @param coins Número de monedas a actualizar
 * @returns Monedas actualizadas o null
 */
export const updateUserCoins = async (id: number, coins: number) => {
  await db.query<User>(UPDATE_USER_COINS_QUERY, [coins, id]);
  const updatedUser = await findUserDataById(id);
  return updatedUser?.coins ?? null;
};

/**
 * Verifica si un usuario tiene suficientes monedas
 *
 * @param id Id de usuario
 * @param coins Número de monedas requeridas
 * @returns true si el usuario tiene suficientes monedas, false en caso contrario
 */
export const checkUserCoins = async (id: number, coins: number) => {
  const user = await findUserDataById(id);
  return (user?.coins ?? 0) >= coins;
};

/**
 * Actualiza el nivel de un usuario
 *
 * @param id Id de usuario
 * @param level Nivel a actualizar
 */
export const updateUserLevel = async (id: number, level: number) => {
  await db.query<User>(UPDATE_USER_LEVEL_QUERY, [level, id]);
}

/**
 * Actualiza las partidas ganadas de un usuario
 *
 * @param id Id de usuario
 * @param gamesWon Partidas ganadas a actualizar
 */
export const updateUserGamesWon = async (id: number, gamesWon: number) => {
  await db.query<User>(UPDATE_USER_GAMES_WON_QUERY, [gamesWon, id]);
}

/**
 * Actualiza el avatar de un usuario
 *
 * @param id Id de usuario
 * @param avatar Avatar a actualizar
 */
export const updateUserAvatar = async (id: number, avatar: string) => {
  await db.query<User>(UPDATE_USER_AVATAR_QUERY, [avatar, id]);
}

/**
 * Envia una solicitud de amistad a un usuario
 * 
 * @param id Id de usuario
 * @param friendId Id de amigo
 * 
 * @returns true si la solicitud se envió correctamente, false en caso contrario
 */
 export const sendFriendRequest = async (id: number, friendId: number) => {

  await db.query<User>(ADD_USER_FRIEND_REQUEST_QUERY, [id, friendId]);
 }

/**
 * Añade un amigo a un usuario
 *
 * @param id Id de usuario
 * @param friendId Id de amigo
 */
export const addUserFriend = async (id: number, friendId: number) => {
  const user = await db.query<User>(FIND_USER_DATA_BY_ID_QUERY, [id]);
  await db.query<User>(ADD_USER_FRIEND_QUERY, [friendId, user.rows[0].username]);
}

