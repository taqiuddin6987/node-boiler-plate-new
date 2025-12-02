import userRoutes from "./user/user.routes.js";
const webRoutes = (fastify, options, done) => {
  fastify.register(userRoutes, { prefix: "/user" });

  done();
};

export default webRoutes;
