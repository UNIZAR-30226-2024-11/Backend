/**
 * @file Controlador de la ruta de registro de usuarios
 * @author Dorian Wozniak <817570@unizar.es>
 */

import bcrypt from "bcrypt"

import { Request, Response } from "express"
import { createUser, findUsersByUsernameOrEmail } from "../model"

/**
 * Solicitud de registro de un nuevo usuario
 */
type RegisterRequest = Request<{}, {}, { username: string; email: string; password: string }>

/**
 * Respuesta de registro de un nuevo usuario
 */
type RegisterResponse = Response<{} | ErrorResponse>

/**
 * Respuesta de error controlado
 */
type ErrorResponse = {
  error: string
}

/**
 *
 * @param req
 * @param res
 * @returns
 */
export const registerController = async (req: RegisterRequest, res: RegisterResponse) => {
  // El cuerpo de la petición tiene datos incorrectos
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.status(400).json({ error: "Faltan parámetros" })
    return
  }

  const { username, email, password } = req.body

  try {
    // Busca si los datos ya están en uso
    const existingUsers = await findUsersByUsernameOrEmail(username, email)

    if (existingUsers.length > 0) {
      res.status(400) // 409 Conflict es otra alternativa de código de estado

      if (existingUsers!.some((user) => user.email === email)) {
        res.json({ error: "Correo ya en uso" })
      } else if (existingUsers!.some((user) => user.username === username)) {
        res.json({ error: "Nombre de usuario ya en uso" })
      }

      return
    }

    // Datos OK, encripta contraseña y crea el usuario
    const hashedPassword = await bcrypt.hash(password, 10)
    await createUser(username, email, hashedPassword)

    res.status(201).json({})
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Registro: Error interno" })
  }
}
