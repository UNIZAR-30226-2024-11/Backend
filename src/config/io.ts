/**
 * @file Configuración de Socket.IO
 * @author Dorian Wozniak <817570@unizar.es>
 */

import { Server } from "socket.io"
import { server } from "./server"
import { events } from "../api"

// Añade soporte para WebSockets a la aplicación
export const io = new Server(server, { cors: { origin: "*" } })

events(io)
