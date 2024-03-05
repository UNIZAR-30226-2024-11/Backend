/**
 * @file Configuración del cliente PostgreSQL
 * @author Dorian Wozniak <817570@unizar.es>
 */

import { Pool } from "pg"

// TODO: Hacer que use variables de entorno
const dbConfig = {
  host: "10.5.0.3",
  port: 5432,
  user: "graham",
  database: "graham-uno-db",
  password: "password",
}

// TODO: Quizas moverlo a un fichero cuando se vuelva grande
const tables = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
)
`

// Configuración de la base de datos
export const db = new Pool(dbConfig)

db.query(tables)
  .then(() => {
    console.log(`Connected to database ${dbConfig.host}:${dbConfig.port}`)
  })
  .catch((err) => {
    console.error(err)
  })
