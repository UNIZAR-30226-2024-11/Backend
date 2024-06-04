import { Request, Response } from "express";
import { findUserDataById, User } from "../model"; // Asegúrate de que la ruta sea correcta

/**
 * Solicitud de datos de usuario
 */
//type UserDataRequest = Request<{}, {}, { id: number }>;

interface SendFriendResponseRequest extends Request {
  params: {
    id: string; // Los parámetros de la URL son cadenas por defecto
  };
}

type SendFriendResponseResponse = Response<{ error: string } | { friends_requests: string[] }>;

/**
 *
 * @param req
 * @param res
 * @returns
 */
export const sendFriendResponseController = async (
  req: SendFriendResponseRequest,
  res: SendFriendResponseResponse,
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
    if (!Array.isArray(user.friends_requests) || user.friends_requests.some((request) => typeof request !== 'string'{
        res.status(500).json({ error: "parametros string del usuario no válidos" });
        return;
    }


    res.status(200).json({ friends_requests: user.friends_requests});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
};
