import HTTP_STATUS from "#utils/http-status";
import tokenHelpers from "#utils/token-helpers";
import fastifyJWT from "@fastify/jwt";
import fastifyPlugin from "fastify-plugin";

function noTokenInHeaderError() {
  const error = new Error(`No Authorization was found in request.headers`);
  error.statusCode = HTTP_STATUS.UNAUTHORIZED;
  error.code = `FST_JWT_NO_AUTHORIZATION_IN_HEADER`;
  error.error = `Unauthorized`;
  throw error;
}
function tokenExpiredError() {
  const error = new Error(`Authorization token expired or invalid`);
  error.statusCode = HTTP_STATUS.UNAUTHORIZED;
  error.code = `FST_JWT_AUTHORIZATION_TOKEN_EXPIRED`;
  error.error = `Unauthorized`;
  throw error;
}
async function myFastifyJWT(fastify, opts) {
  await fastify.register(fastifyJWT, opts.access);
  await fastify.register(fastifyJWT, opts.refresh);

  const { get, del } = tokenHelpers();

  fastify.decorate("authenticateAccess", async function (request, reply) {
    try {
      if (!request.headers.authorization) {
        noTokenInHeaderError();
      }
      const key = request.headers.authorization;
      const result = await get(key);
      if (!result || !result.accessToken) {
        tokenExpiredError();
      }
      request.headers.authorization = `Bearer ${result.accessToken}`;
      await request.accessJwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
  fastify.decorate("authenticateRefresh", async function (request, reply) {
    try {
      if (!request.headers.authorization) {
        noTokenInHeaderError();
      }
      const key = request.headers.authorization;
      const result = await get(key);
      if (!result || !result.refreshToken) {
        tokenExpiredError();
      }
      await del(key);
      request.headers.authorization = `Bearer ${result.refreshToken}`;
      await request.refreshJwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
}

export default fastifyPlugin(myFastifyJWT);
