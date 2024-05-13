/**
 * @file Configuración del cliente PostgreSQL
 * @author Dorian Wozniak <817570@unizar.es>
 */

import { Pool } from "pg"

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWD,
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

//console.log("[INFO]: LA CONEXIÓN CON LA BD ESTÁ DESHABILITADA")
//export const db = new Pool()
