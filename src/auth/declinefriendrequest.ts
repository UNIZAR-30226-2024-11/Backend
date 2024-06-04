import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";

import { Request, Response } from "express";
import { findUserDataById, findUsersByUsernameOrEmail, removeFriendRequest } from "../model";

/**
 * Solicitud de inicio de sesión
 */
type DeclineFriendRequestRequest = Request<{}, {}, { userId: number; username: string }>;

/**
 * Respuesta de inicio de sesión
 */
type DeclineFriendRequestResponse = Response<{ error: string } | { token: string; id: number }>;

export const declineFriendRequestController = async (
  req: DeclineFriendRequestRequest,
  res: DeclineFriendRequestResponse,
) => {
  if (!req.body.userId || !req.body.username) {
    res.status(400).json({ error: "Faltan parámetros" });
    return;
  }

  try {
    const { userId, friendUsername } = req.body;
    const user = await findUserDataById(userId);
    const friend = await findUsersByUsernameOrEmail(friendUsername, '');

    // Verifica que los usuarios existan
    if (!user || !friend) {
        res.status(401).json({ error: "Usuarios no encontrados" });
        return;
    }

    const result = await removeFriendRequest(userId, friend.id);

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
