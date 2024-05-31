import dotenv from "dotenv";

const env = dotenv.config();

import { logger } from "./config";

env ? logger.info(".env file loaded") : logger.error(".env file not loaded");

console.log(env);

import { server } from "./config";

const PORT = Number(process.env.PORT) || 8000;

server.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
