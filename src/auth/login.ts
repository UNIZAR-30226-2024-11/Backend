/**
 * @file Controlador para el inicio de sesión de usuarios
 * @author Dorian Wozniak <817570@unizar.es>
 */

import { sign } from "jsonwebtoken";
import bcrypt from "bcrypt";

import { Request, Response } from "express";
import { findUserByEmail } from "../model";

/**
 * Solicitud de inicio de sesión
 */
type LoginRequest = Request<{}, {}, { email: string; password: string }>;

/**
 * Respuesta de inicio de sesión
 */
type LoginResponse = Response<{ error: string } | { token: string; id: number }>;

export const loginController = async (
  req: LoginRequest,
  res: LoginResponse,
) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ error: "Faltan parámetros" });
    return;
  }

  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    // Verifica que el usuario exista y que la contraseña sea correcta
    if (!user || user.email !== email) {
      res.status(401).json({ error: "Usuario no encontrado" });
      return;
    }

    if (!(user.password && (await bcrypt.compare(password, user.password)))) {
      res.status(401).json({ error: "Contraseña incorrecta" });
      return;
    }

    // Firma un token usando la ID de usuario
    const token = sign({ id: user.id }, "token-secreto-que-deberia-ir-en-env");
    res.status(200).json({ token, id:user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login: Error interno" });
  }
};
