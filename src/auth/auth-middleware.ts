// TODO
// Busca el token JWT. Si lo encuentra, continúa con la petición.
// Si no lo encuentra, responde con un error 401 Unauthorized.

import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthenticatedRequest extends Request {
  user?: { id: number };
}

const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No autenticado" });
    return;
  }

  try {
    const decoded = verify(token, "token-secreto-que-deberia-ir-en-env") as { id: number };
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    res.status(401).json({ error: "Token no válido" });
  }
};

// Usa el middleware de autenticación en las rutas que necesiten autenticación
router.use(authMiddleware);
