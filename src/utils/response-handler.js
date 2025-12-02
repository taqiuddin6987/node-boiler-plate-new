import HTTP_STATUS from "./http-status";

export async function errorHandler(error) {
  const newError = new Error(error.detail ?? error.messange);
  newError.detail = error.detail ?? error.messange;
  newError.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  throw newError;
}

export async function resultErrorHandler(message) {
  const newError = new Error(message);
  newError.detail = message;
  newError.code = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  throw newError;
}
