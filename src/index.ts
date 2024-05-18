import dotenv from "dotenv";

const env = dotenv.config();

env
  ? console.log("[INFO] .env file loaded: ", env.parsed)
  : console.error("[ERROR] .env file not loaded");

import { server } from "./config";

const PORT = Number(process.env.PORT) || 8000;

server.listen(PORT, () => {
  console.log(`[INFO] Server is running on port ${PORT}`);
});
