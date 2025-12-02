import { createTriggerUpdateTimestampTrigger } from "../knex.utilities.js";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.uuid("id").primary().defaultTo(knex.fn.uuid());
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.string("email").notNullable().unique(); // already unique
      table.string("password").notNullable();
      table.string("phone", 25).notNullable().unique(); // unique + limit 25
      table.string("gender");
      table.string("role");
      table.string("avatar");
      table.string("address");
      table.timestamp("dob");
      table.boolean("is_superadmin").defaultTo(false);
      table.boolean("is_active").defaultTo(true);
      table.boolean("is_deleted").defaultTo(false);
      table.timestamps(true, true);
    })
    .raw(createTriggerUpdateTimestampTrigger("users"));
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("users");
}
