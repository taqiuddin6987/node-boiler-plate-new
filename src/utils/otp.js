import { hashAsync, isVerifyAsync } from "#utils/bcrypt";
import { HOUR_IN_MS } from "#utils/timeConstants";
import knex from "#utils/knex";
import MODULE from "#utils/module-names";

const OPT_KEY = (key) => `OTP_KEY:${key}`;

export async function getOTP(phone) {
  const findOne = await knex
    .from(MODULE.SYSTEM.TOKEN)
    .where("key", OPT_KEY(phone))
    .first();

  if (findOne) {
    removeOTP(phone);
  }

  const OTP = Math.floor(1000 + Math.random() * 9000).toString();
  const object = {
    hashedOTP: await hashAsync(OTP),
    expiresAt: Date.now() + HOUR_IN_MS,
  };
  await knex.from(MODULE.SYSTEM.TOKEN).insert({
    key: OPT_KEY(phone),
    value: JSON.stringify(object),
    expires_at: Date.now() + HOUR_IN_MS,
  });
  return OTP;
}

export async function verifyOTP(phone, otp) {
  const OTP = JSON.parse(
    (
      await knex
        .from(MODULE.SYSTEM.TOKEN)
        .select("value")
        .where("key", OPT_KEY(phone))
        .first()
    ).value,
  );
  if (!OTP || OTP.expiresAt < Date.now()) {
    return false;
  }
  return isVerifyAsync(otp, OTP.hashedOTP);
}

export async function removeOTP(phone) {
  await knex.from(MODULE.SYSTEM.TOKEN).where("key", OPT_KEY(phone)).delete();
}
