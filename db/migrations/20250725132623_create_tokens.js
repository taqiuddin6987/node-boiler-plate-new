/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("tokens", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.text("key").nullable();
    table.text("value").nullable();
    table.string("expires_at").nullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("tokens");
}
