import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  transports: [new transports.Console({})],
  format: format.combine(
    format.colorize(),
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.metadata({
      fillExcept: ["message", "level", "timestamp"],
    }),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level}: ${message}`;
    }),
    format.metadata(),
  ),
});
