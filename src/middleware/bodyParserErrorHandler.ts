import { Request, Response, NextFunction } from "express";

/**
 * Captura errores de sintáxis generados por body-parser.
 *
 * @param err Excepción generada
 * @param req Petición
 * @param res Respuesta
 * @param next Siguiente función middleware
 */
export const bodyParserErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof SyntaxError) {
    res.status(400).json({ error: "Petición con JSON incorrecto" });
  } else {
    next(err);
  }
};
