import { Request, Response } from "express"
import { createUser, findUsersByUsernameOrEmail } from "../model"

interface RegisterRequest {
  username: string
  email: string
  password: string
}

interface RegisterResponse {
  error?: string
}

export const registerController = async (req: Request, res: Response) => {
  console.log("[RegisterRequest] Recibido:", req.body)

  if (req.body.username === null || req.body.email === null || req.body.password === null) {
    res.status(400).json({ error: "Faltan parámetros" })
  } else if (Object.keys(req.body).length !== 3) {
    res.status(400).json({ error: "Demasiados parámetros" })
  } else {
    const { username, email, password } = req.body as RegisterRequest

    try {
      const existingUsers = await findUsersByUsernameOrEmail(username, email)

      if (existingUsers !== null && existingUsers!.length > 0) {
        // 409 Conflict es otra alternativa de código de estado
        console.log(existingUsers)
        res.status(400)

        if (existingUsers!.some((user) => user.email === email)) {
          res.json({ error: "Correo ya en uso" } as RegisterResponse)
        } else if (existingUsers!.some((user) => user.username === username)) {
          res.json({ error: "Nombre de usuario ya en uso" } as RegisterResponse)
        } else {
          res.json({ error: "Error desconocido" } as RegisterResponse)
        }
      } else {
        await createUser({ username, email, password })
        res.status(201)
      }
    } catch (err) {
      res.status(500).json({ error: "[Register] Error interno" })
    }
  }
}
