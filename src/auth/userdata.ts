import bcrypt from "bcrypt";

import { Request, Response } from "express";
import { createUser, findUsersByUsernameOrEmail } from "../model";

/**
 * Solicitud de inicio de sesión
 */
type userDataRequest = Request<{}, {}, { email: string; password: string }>;

/**
 * Respuesta de inicio de sesión
 */
type userDataResponse = Response<{ error: string } | { token: string }>;

export const userDataController = async (
    req: userDataRequest,
    res: userDataResponse,
  ) => {
    const userId = req.user.id; // Suponiendo que tienes un middleware de autenticación que añade el ID del usuario al objeto de solicitud.
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