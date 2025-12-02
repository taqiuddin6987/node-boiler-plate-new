console.clear();
import * as crypto from "node:crypto";
import fastify from "fastify";
import fastifyPlugin from "fastify-plugin";
import fastifyCors from "@fastify/cors";
import fastifyEnv from "@fastify/env";
import fastifyMultipart from "@fastify/multipart";
import fastifyFormbody from "@fastify/formbody";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyStatic from "@fastify/static";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";

import envConfig from "#configs/env.config";
import JWTConfig from "#configs/jwt.config";
import multipartConfig from "#configs/multipart.config";
import loggerConfig from "#configs/logger.config";

import loggerPlugin from "#plugins/logger.plugin";
import fastifyJWT from "#plugins/jwt.plugin";

import routes from "#src/routes";
import HTTP_STATUS from "#utils/http-status";
import { swaggerConfig, swaggerUIConfig } from "#configs/swagger.config";
import path from "node:path";
import { startCron } from "./cron-job.js";
import createLogger from "#utils/logger";

startCron();

process.env.TZ = "UTC";

function ajvFilePlugin(ajv) {
  return ajv.addKeyword({
    keyword: "isFile",
    compile: (_schema, parent) => {
      parent.type = "file";
      delete parent.isFile;
      return () => true;
    },
  });
}
const server = fastify({
  logger: false,
  genReqId: () => crypto.randomUUID(),
  ajv: {
    plugins: [ajvFilePlugin],
    customOptions: {
      keywords: ["collectionFormat"],
    },
  },
});

await server.register(fastifyStatic, {
  root: path.resolve("public"),
  prefix: "/public/", // optional: default '/'
});

// console.log("path.resolve(process.cwd()) :>> ", path.resolve(process.cwd()));
await server.register(fastifyEnv, envConfig());
await server.register(fastifyCors, {
  origin: "*",
});

await server.register(helmet, {
  global: true,
});

await server.register(rateLimit, {
  max: 100, // 100 req / minute
  timeWindow: "1 minute",
});

// for Sensitive routes ke liye strict
// server.register(rateLimit, { max: 5, timeWindow: "1 minute" }, "/login");

// await server.register(fastifyMultipart, {
//   limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
// });

// server.register(fastifyFormbody, { bodyLimit: 1024 * 1024 }); // 1MB

await server.register(fastifyFormbody);
await server.register(fastifyMultipart, multipartConfig());
await server.register(loggerPlugin, loggerConfig());
await server.register(fastifySwagger, swaggerConfig());
await server.register(fastifySwaggerUi, swaggerUIConfig());
await server.register(fastifyJWT, JWTConfig(server.config));
await server.register(routes, { prefix: server.config.BASEPATH });

await server.register(
  fastifyPlugin((instance) => {
    instance.decorateRequest("config");
    instance.addHook("onRequest", async (req) => {
      req.config = instance.config;
    });
  })
);

await server.register(
  fastifyPlugin((instance) => {
    instance.decorateRequest("jwt");
    instance.addHook("onRequest", async (req) => {
      req.jwt = instance.jwt;
    });
  })
);
server.get("/", async (req, res) => {
  return res.send({
    statusCode: HTTP_STATUS.OK,
    message: "server is running",
  });
});

server.get("/health", async (req, res) => {
  return res.send({
    statusCode: 200,
    status: "ok",
    uptime: process.uptime(), // server uptime in seconds
    timestamp: new Date().toISOString(),
    version: server.config.VERSION || "1.0.0",
  });
});

server.get("/health/full", async (req, res) => {
  const checks = {
    server: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    cron: "running",
    db: "ok",
  };

  return res.send({
    statusCode: 200,
    status: "healthy",
    checks,
  });
});

const log = await createLogger("SYSTEM_LOGGER");
// log.error(new Error(`uncaughtException: Test`));
// log.info("err");

const start = async () => {
  try {
    await server.listen({ host: server.config.HOST, port: server.config.PORT });
    const host =
      server.config.HOST === "0.0.0.0" ? "localhost" : server.config.HOST;
    // console.log(`server is listening at http://${host}:${server.config.PORT}`);
    server.log.info({
      message: `server is listening at http://${host}:${server.config.PORT}`,
    });
    log.info(`server is listening at http://${host}:${server.config.PORT}`);
  } catch (err) {
    log.info(new Error(`uncaughtException: ${err.message}`));
    process.exit(1);
  }
};

// Graceful shutdown
function gracefulShutdown() {
  server.close(() => {
    const host =
      server.config.HOST === "0.0.0.0" ? "localhost" : server.config.HOST;
    server.log.info({
      message: `Server is shutting down at http://${host}:${server.config.PORT}`,
    });
    log.info(`Server is shutting down at http://${host}:${server.config.PORT}`);
    process.exit(0);
  });
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

start();
