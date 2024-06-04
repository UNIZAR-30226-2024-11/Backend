import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";

import { Request, Response } from "express";
import { findUserDataById, sendFriendRequest } from "../model";

/**
 * Solicitud de inicio de sesión
 */
type SendFriendRequestRequest = Request<{}, {}, { userId: number; friendId: number }>;

/**
 * Respuesta de inicio de sesión
 */
type SendFriendRequestResponse = Response<{ error: string } | { token: string; id: number }>;

export const SendFriendRequestController = async (
  req: SendFriendRequestRequest,
  res: SendFriendRequestResponse,
) => {
  if (!req.body.userId || !req.body.friendId) {
    res.status(400).json({ error: "Faltan parámetros" });
    return;
  }

  try {
    const { userId, friendId } = req.body;
    const user = await findUserDataById(userId);
    const friend = await findUserDataById(friendId);

    // Verifica que los usuarios existan
    if (!user || !friend) {
        res.status(401).json({ error: "Usuarios no encontrados" });
        return;
    }

    const result = await sendFriendRequest(userId, friendId);

    // Asegura que `user.id` es un número
    if (typeof user.id !== 'number') {
        res.status(500).json({ error: "ID del usuario no válido" });
        return;
    }
    
    // Firma un token usando la ID de usuario
    const token = sign({ id: user.id }, "token-secreto-que-deberia-ir-en-env");
    res.status(200).json({ token, id: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login: Error interno" });
  }
};
