import { errorHandler } from "#utils/db-query-helpers";
import MODULE from "#utils/module-names";
import promiseHandler from "#utils/promise-handler";
import knex from "#utils/knex";

const create = async (data) => {
  const promise = knex(MODULE.SYSTEM.TOKEN).insert(data).returning("*");
  const [error, result] = await promiseHandler(promise);
  if (!result) errorHandler(error);

  return result[0];
};

const getToken = async (key) => {
  const promise = knex
    .select("*")
    .from(MODULE.SYSTEM.TOKEN)
    .where("key", key)
    .first();
  const [error, result] = await promiseHandler(promise);
  if (!result) errorHandler(error);

  return result;
};

const deleteToken = async (key) => {
  const promise = knex.from(MODULE.SYSTEM.TOKEN).where("key", key).delete();
  const [error, result] = await promiseHandler(promise);
  if (!result) errorHandler(error);

  return result;
};

export default {
  create,
  getToken,
  deleteToken,
};
