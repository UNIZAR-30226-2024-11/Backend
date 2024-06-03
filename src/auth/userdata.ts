import { Request, Response } from "express";
import { findUserDataById, User } from "../model"; // Asegúrate de que la ruta sea correcta

/**
 * Solicitud de datos de usuario
 */
//type UserDataRequest = Request<{}, {}, { id: number }>;

interface UserDataRequest extends Request {
  params: {
    id: string; // Los parámetros de la URL son cadenas por defecto
  };
}

type UserDataResponse = Response<{ error: string } | { id: number; username: string; email: string; avatar: string; level: number; games_won: number; coins: number }>;

/**
 *
 * @param req
 * @param res
 * @returns
 */
export const userDataController = async (
  req: UserDataRequest,
  res: UserDataResponse,
) => {
  const userId = parseInt(req.params.id, 10); // Convierte el ID a un número
  if (isNaN(userId)) {
    res.status(400).json({ error: "ID de usuario no válido" });
    return;
  }
  try {
    const user = await findUserDataById(userId);
    if (!user) {
      res.status(401).json({ error: `Usuario con id ${userId} no encontrado` });
      return;
    }

    // Asegura que `user.email` es un string
    if (typeof user.email !== 'string') {
      res.status(500).json({ error: "email del usuario no válido" });
      return;
    }

    res.status(200).json({ id: user.id, username: user.username, email: user.email, avatar: user.avatar, level: user.level, games_won: user.games_won, coins: user.coins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
};
