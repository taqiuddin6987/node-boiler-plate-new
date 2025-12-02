/**
 * @typedef {import('json-schema').JSONSchema7} JSONSchema
 */

import { Type } from "@sinclair/typebox";

const swagger = {
  signin: {
    description: "this will sign in user",
    tags: ["WEB|User"],
    summary: "sign in user",
    operationId: "userSignIn",
    body: Type.Object(
      {
        email: Type.String(),
        password: Type.String({ minLength: 4 }),
      },
      { additionalProperties: false },
    ),
  },
  logout: {
    description: "this will sign out user",
    tags: ["WEB|User"],
    summary: "sign out user",
    operationId: "userSignOut",
    body: Type.Object(
      {
        invalidateAllTokens: Type.Boolean(),
      },
      { additionalProperties: false },
    ),
  },
  // create: {
  //   description: 'this will create Feedback',
  //   tags: ['ADMIN|Feedback'],
  //   summary: 'Feedback page',
  //   operationId: 'CreateFeedback',
  //   consumes: ['multipart/form-data'],
  //   body: Type.Object(
  //     {
  //       title: Type.String(),
  //       price: Type.Number({ default: 0 }),
  //       discountedPrice: Type.Number({ default: 0 }),
  //       icon: Type.Optional(Type.Any({ isFile: true })),
  //       shortDescription: Type.Optional(Type.String()),
  //       detailDescription: Type.Optional(Type.String()),
  //       'images[]': Type.Union([
  //         Type.Array(Type.Any({ isFile: true })),
  //         Type.Any({ isFile: true }),
  //       ]),
  //     },
  //     { additionalProperties: false }
  //   ),
  // },

  /** @type {JSONSchema} */
  signup: {
    description: "this will create in user",
    tags: ["WEB|User"],
    summary: "create in user",
    operationId: "userCreate",
    body: Type.Object(
      {
        firstName: Type.String(),
        lastName: Type.String(),
        email: Type.String({ format: "email" }),
        password: Type.String({ minLength: 4 }),
        gender: Type.String(),
        role: Type.Optional(Type.String()),
        dob: Type.String({ format: "date" }),
      },
      { additionalProperties: false },
    ),
  },
  userList: {
    description: "this will list users",
    tags: ["WEB|User"],
    summary: "list user",
    operationId: "useList",
    security: [{ AuthorizationAccess: [] }],
    querystring: Type.Object(
      {
        page: Type.Integer({ default: 0, minimum: 0 }),
        size: Type.Integer({ default: 10, minimum: 10 }),
        search: Type.Optional(Type.String()),
      },
      { additionalProperties: false },
    ),
  },
  updateUser: {
    description: "this will update in user",
    tags: ["WEB|User"],
    summary: "update in user",
    operationId: "userUpdate",
    consumes: ["multipart/form-data"],
    security: [{ AuthorizationAccess: [] }],
    params: Type.Object(
      {
        id: Type.Integer({ format: "uuid" }),
      },
      { additionalProperties: false },
    ),
    body: Type.Object(
      {
        firstName: Type.String(),
        lastName: Type.String(),
        gender: Type.String(),
        dob: Type.String({ format: "date" }),
        avatar: Type.Optional(Type.Any({ isFile: true })),
      },
      { additionalProperties: false },
    ),
  },
};

export default swagger;
