import dotenv from "dotenv"
console.log(dotenv.config())

export { app } from "./express"
export { server } from "./server"
export { socket } from "./io"
export { db } from "./pg"
