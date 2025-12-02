// utils/keyGenerator.js
import crypto from "crypto";

export function generateKey(length = 32) {
  return crypto.randomBytes(length).toString("base64url").substring(0, length);
}
