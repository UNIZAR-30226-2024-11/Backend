import bodyParser from "body-parser"
import cors from "cors"
import express, { Request, Response, NextFunction } from "express"

import { router } from "../api"

/**
 * Captura errores de sintáxis generados por body-parser.
 *
 * @param err Excepción generada
 * @param req Petición
 * @param res Respuesta
 * @param next Siguiente función middleware
 */
const bodyParserErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError) {
    res.status(400).json({ error: "Petición con JSON incorrecto" })
  } else {
    next(err)
  }
}

export const app = express()

// Usa body-parser para procesar los cuerpos de las solicitudes
app.use(bodyParser.json())
app.use(bodyParserErrorHandler)

// CORS gestiona las peticiones de otros dominios
// TODO: Restringir origen a los frontends. Por ahora permite todo
app.use(cors())

// Importa los controladores de la API
app.use("/api", router)
