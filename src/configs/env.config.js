import path from "node:path";
import { Type } from "@sinclair/typebox";
const ENV_SCHEMA = Type.Object({
  PORT: Type.Integer({
    maximum: 65535,
    minimum: 1000,
  }),
  PROTOCOL: Type.String(),
  HOST: Type.String(),
  BASEPATH: Type.String(),
  DB_USER: Type.String(),
  DB_PASSWORD: Type.String(),
  DB_HOST: Type.String(),
  DB_PORT: Type.Integer({
    maximum: 65535,
    minimum: 1000,
  }),
  DATABASE: Type.String(),
  ACCESS_JWT_SECRET: Type.String(),
  ACCESS_JWT_EXPIRES_IN: Type.String(),
  REFRESH_JWT_SECRET: Type.String(),
  REFRESH_JWT_EXPIRES_IN: Type.String(),
});

function envConfig() {
  return {
    confKey: "config",
    dotenv: {
      path: path.resolve(`.env.${process.env.NODE_ENV}`),
    },
    ajv: {
      customOptions: (ajv) => ajv.addSchema({ coerceTypes: true }),
    },
    schema: ENV_SCHEMA,
  };
}

export default envConfig;
