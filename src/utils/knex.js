import knex from "knex";
import knexConfig from "#configs/knex.config";

import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(`.env.${process.env.NODE_ENV}`),
});

/** @type {import('knex').Knex} */
export default knex(
  knexConfig({
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DATABASE,
  }),
);
