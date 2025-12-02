import knex from "#utils/knex";
import MODULE from "#utils/module-names";

export async function expiredTokens() {
  await knex(MODULE.SYSTEM.TOKEN)
    .whereRaw(`created_at + (expires_at || ' seconds')::interval < now()`)
    .del();
}
