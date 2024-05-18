/**
 * @author Dorian Wozniak <817570@unizar.es>
 */

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

import { router } from "../api/routes";
import { bodyParserErrorHandler } from "../middleware/bodyParserErrorHandler";

// Express

export const app = express();

app.use(bodyParser.json());
app.use(bodyParserErrorHandler);

app.use(cors());

app.use("/api", router);

export const server = createServer(app);

// Socket.io

export const io = new Server(server, { cors: { origin: "*" } });

import "../api/events";
