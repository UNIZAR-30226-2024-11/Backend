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
  console.log("[LoginRequest] Recibido:", req.body)

  const { email, password } = req.body as LoginRequest

  if (req.body.email === null || req.body.password === null) {
    res.status(400).json({ error: "Faltan parámetros" })
  } else if (Object.keys(req.body).length !== 2) {
    res.status(400).json({ error: "Demasiados parámetros" })
  } else {
    try {
      const user = await findUserByEmail(email)

      if (user === null || user!.email !== email) {
        res.status(401).json({ error: "Usuario no encontrado" } as LoginResponse)
      } else if (user!.password !== password) {
        res.status(401).json({ error: "Contraseña incorrecta" } as LoginResponse)
      } else {
        // TODO: Crear token
        res.status(200).json()
      }
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: "Error interno" } as LoginResponse)
    }
  }
}
