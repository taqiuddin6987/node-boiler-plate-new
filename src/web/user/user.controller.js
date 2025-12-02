// import promiseHandler from '#utilities/promise-handler';
import promiseHandler from "#utils/promise-handler";
import service from "./user.service.js";

const wrap = (callback) => async (req, res) => {
  const log = req.logger;
  // log.info("This is a log message");
  log.verbose(`RequestId:: ${req.id}\nHandling ${req.method} ${req.url} Route`);
  const [error, result] = await promiseHandler(callback(req));
  if (error) {
    log.verbose(
      `RequestId:: ${req.id}\nHandling Completed With Error On ${req.method} ${req.url} Route`,
    );
    log.error(
      `${error.message}\nRequestId:: ${req.id}\nTrace:: ${error.stack}`,
    );

    return res.status(error.code).send({
      success: false,
      code: error.code,
      statusCode: error.code,
      message: error.message,
    });
  }

  log.verbose(
    `RequestId:: ${req.id}\nHandling Completed With Success On ${req.method} ${req.url} Route`,
  );

  return res.status(result.code).send({
    success: true,
    code: result.code,
    statusCode: result.code,
    message: result.message,
    data: result.data,
  });
};

export default {
  signup: wrap(service.signup),
  signin: wrap(service.signin),
  updateUser: wrap(service.updateUser),
  userList: wrap(service.userList),
};
