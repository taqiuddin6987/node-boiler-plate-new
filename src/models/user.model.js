import { errorHandler, textFilterHelper } from "#utils/db-query-helpers";
// import { hashAsync } from "#utilities/bcrypt";
import MODULE from "#utils/module-names";
import promiseHandler from "#utils/promise-handler";
import knex from "#utils/knex";
import {
  getLimitAndOffset,
  getPaginationObject,
} from "#utils/pagination-helpers";

const signup = async (data) => {
  const promise = knex(MODULE.WEB.USER).insert(data).returning("*");
  const [error, result] = await promiseHandler(promise);
  if (!result) errorHandler(error);

  return result[0];
};

const signin = async (req) => {
  const promise = knex
    .select("*")
    .from(MODULE.WEB.USER)
    .where((qb) => {
      qb.orWhere("email", req.body.email);
      // qb.orWhere("phone", req.body.identifier);
    })
    .first();
  const [error, result] = await promiseHandler(promise);
  if (!result) errorHandler(error);

  return result;
};

const update = async (req) => {
  const promise = knex(MODULE.WEB.USER)
    .update(req.body)
    .where({ id: req.params.id })
    .returning("*");
  const [error, result] = await promiseHandler(promise);
  if (!result) errorHandler(error);

  return result[0];
};

const userList = async (req) => {
  const { search, page, limit } = req.query;

  const query = knex
    .from(MODULE.APP.USER)
    .where({ is_active: true, is_deleted: false, is_admin: false })
    .modify(
      textFilterHelper(search, [
        `${MODULE.APP.USER}.first_name`,
        `${MODULE.APP.USER}.last_name`,
      ]),
    );

  const totalQuery = query.clone().count();
  const [size, offset] = getLimitAndOffset({ page, size: limit });
  const filteredQuery = query
    .clone()
    .orderBy([{ column: "created_at", order: "desc" }])
    .limit(size)
    .offset(offset)
    .select("*");

  const [[{ count: totalRecordCount }], records] = await Promise.all([
    totalQuery,
    filteredQuery,
  ]);

  const total = Number(totalRecordCount) || 0;
  const pagination = getPaginationObject({ page, limit, total });

  return {
    list: records,
    ...pagination,
  };
};

export default {
  signup,
  signin,
  update,
  userList,
};
