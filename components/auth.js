var response = require("./response/response_util");

var { ResponseCode } = require("./response/response_code_store");
var {
  ExceptionType,
  createException,
  convertException,
} = require("./exception/exception_creator");
var { decodePayload } = require("./jwt");
auth = {};

auth.signCondition = function (req, res, next) {
  var token = req.headers["authorization"];
  // var userId = req.headers["userid"];
  const decodedToken = decodePayload(token);

  req.decoded = {
    token: token,
    id: decodedToken.userId,
    joinType: decodedToken.joinType,
  };

  next();
};

auth.isSignIn = function (req, res, next) {
  var token = req.headers["authorization"];
  // var userId = req.headers["userid"];
  const decodedToken = decodePayload(token);

  if (!token || !decodedToken.userId) {
    var error = createException(ExceptionType.REQUIRED_JWT_TOKEN);
    res.json(response.fail(error, error.errmsg, error.code));
  } else {
    req.decoded = {
      token: token,
      id: decodedToken.userId,
      joinType: decodedToken.joinType,
    };

    next();
  }
};

auth.isAdmin = function (req, res, next) {
  var token = req.headers["authorization"];
  const decodedToken = decodePayload(token);

  if (token != null && token == "admin") {
    req.decoded = {
      token: req.headers["authorization"],
      id: 1,
      joinType: 0,
    };
    next();
  } else {
    var error = createException(ExceptionType.REQUIRED_JWT_TOKEN);
    res.json(response.fail(error, error.errmsg, error.code));
  }
};

module.exports = auth;
