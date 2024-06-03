import { Request, Response } from "express";
import { findUserDataById } from "../model"; // Asegúrate de que la ruta sea correcta

/**
 * Solicitud de datos de usuario
 */
type UserDataRequest = Request<{}, {}, { email: string }>;

type UserDataResponse = Response<{ error: string } | any>;

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
  if (!req.body.email) {
    res.status(400).json({ error: "Faltan parámetros" });
    return;
  }
  try {
    const { email } = req.body;
    const userData = await findUserDataById(email);
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
