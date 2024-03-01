import { Request, Response } from "express"
import { findUserByEmail } from "../model"

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  error?: string
}

export const loginController = async (req: Request, res: Response) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ error: "Faltan parámetros" })
    return
  }

  const { email, password } = req.body as LoginRequest
  const user = await findUserByEmail(email)

  if (!user || user.email !== email) {
    res.status(401).json({ error: "Usuario no encontrado" } as LoginResponse)
    return
  } else if (user.password !== password) {
    res.status(401).json({ error: "Contraseña incorrecta" } as LoginResponse)
    return
  }

  // TODO: Crear token
  res.status(200).json()
}
