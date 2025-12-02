import controller from "./user.controller.js";
import schema from "./user.swagger.js";

const userRoutes = (fastify, options, done) => {
  fastify.post("/signup", { schema: schema.signup }, controller.signup);
  fastify.post("/signin", { schema: schema.signin }, controller.signin);
  fastify.patch(
    "/update/:id",
    {
      schema: schema.updateUser,
      onRequest: [fastify.authenticateAccess],
    },
    controller.updateUser,
  );
  fastify.get(
    "/list",
    { schema: schema.userList, onRequest: [fastify.authenticateAccess] },
    controller.userList,
  );

  // fastify.post(
  //   '/logout',
  //   {
  //     schema: schema.logout,
  //     // onRequest: [fastify.authenticateAccess],
  //   },
  //   controller.logout
  // );

  done();
};

export default userRoutes;
