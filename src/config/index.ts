import dotenv from "dotenv";
console.log(dotenv.config());

export { app } from "./express";
export { server } from "./server";
export { io as socket } from "./io";
export { db } from "./pg";
