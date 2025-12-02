import webRoutes from "./web/web.routes.js";
const routes = (fastify, options, done) => {
  fastify.register(webRoutes, { prefix: "/web" });
  done();
};

export default routes;
