import { Request, Response } from "express";
import { findUsersByUsernameOrEmail, User } from "../model"; // Asegúrate de que la ruta sea correcta

/**
 * Solicitud de datos de usuario
 */
//type UserDataRequest = Request<{}, {}, { id: number }>;

interface searchPersonRequest extends Request {
  params: {
    email: string; // Los parámetros de la URL son cadenas por defecto
  };
}

type searchPersonResponse = Response<{ error: string } | { id: number}>;

/**
 *
 * @param req
 * @param res
 * @returns
 */
export const searchPersonController = async (
  req: searchPersonRequest,
  res: searchPersonResponse,
) => {
  const userEmail = req.params.email;
  if (typeof userEmail !== 'string') {
    res.status(400).json({ error: "Email de usuario no válido" });
    return;
  }
  try {
    const user = await findUsersByUsernameOrEmail('', userEmail);
    if (!user[0]) {
      res.status(401).json({ error: `Usuario con email ${userEmail} no encontrado` });
      return;
    }

    // Asegura que sea string
    if (typeof user[0].id !== 'number') {
      res.status(500).json({ error: "parametros ID del usuario no válidos" });
      return;
    }

    res.status(200).json({ id: user[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error interno" });
  }
};
