import { createLogger, transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: "./logs/app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
    }),
  ],
});

export default logger;
