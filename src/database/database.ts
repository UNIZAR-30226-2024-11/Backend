import { Pool } from "pg"

// TODO: Hacer que use variables de entorno
const HOST = "10.5.0.3"
const PORT = 5432
const USER = "graham"
const DATABASE = "graham-uno-db"
const PASSWORD = "password"

/**
 * Configura la base de datos, creando las tablas necesarias si no existen.
 *
 * @param db Conexión a base de datos
 */
const setupDatabase = async (db: Pool) => {
  // Abre el fichero sql/schema.sql
  try {
    const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
    `
    await db.query(schema)

    console.log("Database setup complete")
  } catch (err) {
    console.error(err)
  }
}

export const db = new Pool({
  host: HOST,
  port: PORT,
  user: USER,
  database: DATABASE,
  password: PASSWORD,
})

setupDatabase(db)
