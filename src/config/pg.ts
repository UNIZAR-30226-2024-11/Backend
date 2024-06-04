/**
 * @file Configuración del cliente PostgreSQL
 * @author Dorian Wozniak <817570@unizar.es>
 */

import { Pool } from "pg";
import { logger } from "./logger";

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWD,
};

/*
Descripción de las tablas:
user -> usuario de la aplicación
game -> información de una partida
player -> información de un jugador
player_card -> mano de cartas de un jugador en un partida
*/

const tables = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  avatar TEXT DEFAULT 'default.png',
  level INT DEFAULT 1,
  games_won INT DEFAULT 0,
  games_played INT DEFAULT 0,
  coins INT DEFAULT 0,
  friends TEXT[] DEFAULT '{}',
  friend_requests TEXT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS player (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS game (
  id SERIAL PRIMARY KEY,
  player1 INT NOT NULL,
  player2 INT NOT NULL,
  player3 INT NOT NULL,
  player4 INT NOT NULL,
  current_player INT NOT NULL,
  direction INT NOT NULL,
  sumToDraw INT NOT NULL,
  hasSkipped INT NOT NULL,
  currentWildColor TEXT NOT NULL,
  tableDeck JSON[] DEFAULT '{}'::JSON[],
  drawDeck JSON[] DEFAULT '{}'::JSON[],
  FOREIGN KEY (player1) REFERENCES player(id),
  FOREIGN KEY (player2) REFERENCES player(id),
  FOREIGN KEY (player3) REFERENCES player(id),
  FOREIGN KEY (player4) REFERENCES player(id)
);

CREATE TABLE IF NOT EXISTS player_card (
  id SERIAL PRIMARY KEY,
  game INT NOT NULL,
  player INT NOT NULL,
  hand JSON[] DEFAULT '{}'::JSON[],
  FOREIGN KEY (game) REFERENCES game(id),
  FOREIGN KEY (player) REFERENCES player(id)
);
`;

export const db = new Pool(dbConfig);

db.query(tables)
  .then(() => {
    logger.info(`Connected to database ${dbConfig.host}:${dbConfig.port}`);
  })
  .catch((err: Error) => {
    logger.error(
      `Could not connect to database ${process.env.DB_HOST}:${process.env.DB_PORT}`,
    );
  });
