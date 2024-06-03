import { Request, Response } from "express";
import { findUserDataById, User } from "../model"; // Asegúrate de que la ruta sea correcta

/**
 * Solicitud de datos de usuario
 */
type UserDataRequest = Request<{}, {}, { id: number }>;

type UserDataResponse = Response<{ error: string } | { email: string }>;

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
  if (!req.body.id) {
    res.status(400).json({ error: "Falta parámetro id" });
    return;
  }
  try {
    const { id } = req.body;
    const user = await findUserDataById(id);
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    // Asegura que `user.email` es un string
    if (typeof user.id !== 'string') {
      res.status(500).json({ error: "email del usuario no válido" });
      return;
    }

    res.status(200).json({ email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
};
