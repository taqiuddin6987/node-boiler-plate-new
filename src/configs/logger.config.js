import createLogger from "#utils/logger";

// const adminLogger = await createLogger("ADMIN_LOGGER");
const webLogger = await createLogger("WEB_LOGGER");

function loggerConfig() {
  return {
    loggers: [{ path: "/api/v1/web", logger: webLogger }],
  };
}

export default loggerConfig;
