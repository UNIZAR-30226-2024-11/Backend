import { Request, Response } from "express";
import { findUserDataById, User } from "../model"; // Asegúrate de que la ruta sea correcta

/**
 * Solicitud de datos de usuario
 */
//type UserDataRequest = Request<{}, {}, { id: number }>;

interface friendsListRequest extends Request {
  params: {
    id: string; // Los parámetros de la URL son cadenas por defecto
  };
}

type friendsListResponse = Response<{ error: string } | { friends: string[] }>;

/**
 *
 * @param req
 * @param res
 * @returns
 */
export const friendsListController = async (
  req: friendsListRequest,
  res: friendsListResponse,
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

    // Asegura que sean strings
    if (!Array.isArray(user.friends)){
        res.status(500).json({ error: "parametros string del usuario no válidos" });
        return;
    }


    res.status(200).json({ friends: user.friends});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
};
