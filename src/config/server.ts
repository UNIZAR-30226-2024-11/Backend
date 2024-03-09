/**
 * @file Configuración del servidor HTTP
 * @author Dorian Wozniak <817570@unizar.es>
 */

// TODO: Usar HTTPS en vez de HTTP
import { createServer } from "http"

import { app } from "./express"

const server = createServer(app)

export { server }
