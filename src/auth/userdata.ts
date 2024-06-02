import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { createUser, findUsersByUsernameOrEmail, findUserDataById } from "../model"; // Asegúrate de que findUserDataById esté importado

/**
 * Interfaz para la solicitud autenticada que incluye el ID del usuario.
 */
interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

/**
 * Tipo de respuesta para la solicitud de datos de usuario.
 */
type UserDataResponse = Response<{ error: string } | any>; // Ajusta el tipo de respuesta según los datos que vayas a enviar

export const userDataController = async (
  req: AuthenticatedRequest,
  res: UserDataResponse,
) => {
  const userId = req.user?.id; // Usa el operador de encadenamiento opcional para evitar errores si user es undefined
  if (!userId) {
    res.status(401).json({ error: "No autenticado" });
    return;
  }

  try {
    const userData = await findUserDataById(userId);
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
