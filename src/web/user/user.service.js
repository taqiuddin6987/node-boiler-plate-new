import model from "#models/user.model";
import tokenModel from "#models/token.model";
import HTTP_STATUS from "#utils/http-status";
import promiseHandler from "#utils/promise-handler";
import { hashAsync, isVerifyAsync } from "#utils/bcrypt";
import { generateKey } from "#utils/keyGenerator";
import ms from "ms";
import uploadFile from "#utils/uploadFile";

const signup = async (req) => {
  const newPassword = await hashAsync(req.body.password);
  const data = {
    ...req.body,
    password: newPassword,
  };
  const promise = model.signup(data);

  const [error, result] = await promiseHandler(promise);
  if (!result) {
    const err = new Error(error.detail ?? error.message);
    err.code = error.code ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
    throw err;
  }

  return {
    code: HTTP_STATUS.OK,
    message: "signed in successfully.",
    data: result,
  };
};

const signin = async (req) => {
  const promise = model.signin(req);

  const [error, result] = await promiseHandler(promise);
  if (!result) {
    const err = new Error(error.detail ?? error.message);
    err.code = error.code ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
    throw err;
  }

  if (!result.isActive) {
    const err = new Error("User is not activate");
    err.code = error.code ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
    throw err;
  }

  const isPasswordMatch = await isVerifyAsync(
    req.body.password,
    result.password
  );

  if (!isPasswordMatch) {
    const err = new Error(`invalid credentials`);
    err.code = HTTP_STATUS.UNAUTHORIZED;
    throw err;
  }

  delete result.password;
  const { id, email } = result;

  const accessToken = req.jwt.access.sign({
    id,
    email,
  });

  const refreshToken = req.jwt.refresh.sign({
    id,
  });

  const expiresAt = ms(req.config.REFRESH_JWT_EXPIRES_IN) / 1000;

  const tokenKey = generateKey();

  const newData = {
    key: tokenKey,
    value: JSON.stringify({ accessToken, refreshToken }),
    expiresAt,
  };

  const tokenPromise = tokenModel.create(newData);

  const [errorToken, resultToken] = await promiseHandler(tokenPromise);
  if (!resultToken) {
    const err = new Error(errorToken.detail ?? errorToken.message);
    err.code = errorToken.code ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
    throw err;
  }

  delete result.tokenKey;
  delete result.refreshToken;

  // await verifyOTP(phone, otp);
  // await removeOTP(phone);
  // await getOTP(phone);

  return {
    code: HTTP_STATUS.OK,
    message: "signed in successfully.",
    data: { ...result, token: tokenKey },
  };
};

const updateUser = async (req) => {
  if (req.body.avatar) {
    const file = uploadFile(req.body.avatar, "profile");
    const [error, result] = await promiseHandler(file);
    if (!result) {
      const err = new Error(error.detail ?? error.message);
      err.code = error.code ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
      throw err;
    }
    req.body.avatar = result;
  }
  const promise = model.update(req);

  const [error, result] = await promiseHandler(promise);
  if (!result) {
    const err = new Error(error.detail ?? error.message);
    err.code = error.code ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
    throw err;
  }

  return {
    code: HTTP_STATUS.OK,
    message: "signed in successfully.",
    data: result,
  };
};

const userList = async (req) => {
  const [error, result] = await promiseHandler(model.userList(req));
  if (!result) {
    const err = new Error(error?.detail ?? error?.message ?? "User not found");
    err.code = error?.code ?? HTTP_STATUS.INTERNAL_SERVER_ERROR;
    throw err;
  }

  return {
    code: HTTP_STATUS.OK,
    message: "Users has been fetched successfully",
    data: { ...result },
  };
};

export default {
  signup,
  signin,
  updateUser,
  userList,
};
