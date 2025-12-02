import { input } from "@inquirer/prompts";
import pkg from "bcryptjs";
const { hashSync } = pkg;

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function script(knex) {
  const transaction = await knex.transaction();

  const firstName = await input({ message: "enter first name:  " });
  if (!firstName) {
    throw new Error("first name is required");
  }

  const lastName = await input({ message: "enter last name:  " });
  if (!lastName) {
    throw new Error("last name is required");
  }

  const email = await input({ message: "enter email:  " });
  if (!email) {
    throw new Error("email is required");
  }

  const phone = await input({ message: "enter phone:  " });
  if (!email) {
    throw new Error("phone is required");
  }

  const password = await input({ message: "enter user password:  " });
  if (!password) {
    throw new Error("password is required");
  }
  const gender = await input({ message: "enter user gender:  " });
  if (!gender) {
    throw new Error("gender is required");
  }

  try {
    await transaction("users")
      .insert({
        first_name: firstName,
        last_name: lastName,
        password: hashSync(password, 12),
        email,
        address: "test road abc",
        phone,
        gender,
        is_superadmin: true,
        is_active: true,
      })
      .returning("*");

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
