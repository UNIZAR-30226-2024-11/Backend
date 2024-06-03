import { Request, Response } from "express";
import { findUserDataById, User } from "../model"; // Asegúrate de que la ruta sea correcta

/**
 * Solicitud de datos de usuario
 */
//type UserDataRequest = Request<{}, {}, { id: number }>;

// Los parámetros de la URL son cadenas por defecto
// Debe tener este formato
interface UserDataRequest extends Request {
  params: {
    id: string; 
  };
}
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
  const userId = parseInt(req.params.id, 10); // Convierte el ID a un número

  if (isNaN(userId)) {
    res.status(400).json({ error: "ID de usuario no válido" });
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
