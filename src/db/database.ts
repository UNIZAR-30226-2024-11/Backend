import { Pool } from "pg"

// TODO: Hacer que use variables de entorno
const HOST = "10.5.0.3"
const PORT = 5432
const USER = "graham"
const DATABASE = "graham-uno-db"
const PASSWORD = "password"

export const db = new Pool({
  host: HOST,
  port: PORT,
  user: USER,
  database: DATABASE,
  password: PASSWORD,
})
