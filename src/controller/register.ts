import { Request, Response } from "express"
import { createUser, findUsersByUsernameOrEmail } from "../model"

// TODO: Tiene que haber una mejor forma de hacer esto

interface RegisterRequest {
  username: string
  email: string
  password: string
}

interface RegisterResponse {
  error?: string
}

/**
 *
 * @param req
 * @param res
 * @returns
 */
export const registerController = async (req: Request, res: Response) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    res.status(400).json({ error: "Faltan parámetros" })
    return
  }

  const { username, email, password }: RegisterRequest = req.body
  const existingUsers = await findUsersByUsernameOrEmail(username, email)

  // 409 Conflict es otra alternativa de código de estado
  if (existingUsers.length > 0) {
    res.status(400)

    if (existingUsers!.some((user) => user.email === email)) {
      res.json({ error: "Correo ya en uso" } as RegisterResponse)
    } else if (existingUsers!.some((user) => user.username === username)) {
      res.json({ error: "Nombre de usuario ya en uso" } as RegisterResponse)
    }

    return
  }

  await createUser({ username, email, password })
  res.status(201).json({})
}
