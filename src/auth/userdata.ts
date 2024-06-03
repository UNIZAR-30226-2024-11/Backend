import { Request, Response } from "express";
import { findUserDataById, User } from "../model"; // Asegúrate de que la ruta sea correcta

/**
 * Solicitud de datos de usuario
 */
type UserDataRequest = Request<{}, {}, { id: number }>;

type UserDataResponse = Response<{ error: string } | User>;

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
    res.status(400).json({ error: "Faltan parámetro id" });
    return;
  }
  try {
    const { id } = req.body.id;
    const userData = await findUserDataById(id);
    if (!userData) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
};
