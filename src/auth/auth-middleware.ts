// src/auth/auth-middleware.ts

import { Router, Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

const router = Router();

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

// Exporta el router si es necesario
export { router, authMiddleware };
