import dotenv from "dotenv";

import app from "./app";
import logger from "./utils/logger";
import mongoose from "mongoose";
import http from "http";
import { setupSocket } from "./socket/socket";
import { seedAdmin } from "./utils/adminSeeder";
dotenv.config();
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const mongoUri: string = process.env.MONGO_URI!;
const port = process.env.port ?? 8080;

async function startServer(conn: string) {
  try {
    await mongoose.connect(conn);
    await seedAdmin();
    const server = http.createServer(app);
    server.listen(port);
    setupSocket(server);
  } catch (error) {
    logger.error(`Error starting the server, Error is ${error}. Exiting the process...!!`);
    process.exit(1);
  }
}

startServer(mongoUri);

process.on("SIGQUIT", function () {
  logger.info("From Local - Caught SIGQUIT signal");
  // Close mongoDB connection then exit
  mongoose.connection.close();
  process.exit(0);
});

process.on("SIGTERM", function () {
  logger.info("From Local - Caught SIGTERM signal");
  // Close mongoDB connection then exit
  mongoose.connection.close();
  process.exit(1);
});
