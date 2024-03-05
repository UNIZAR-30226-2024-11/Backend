/**
 * @file Punto de entrada de la aplicación
 */

import { server } from "./config"

const PORT = Number(process.env.PORT) || 8000

// Lanza el servidor
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
