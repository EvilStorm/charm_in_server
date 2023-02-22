var express = require("express");
var router = express.Router();

var response = require("../components/response/response_util");
var { ResponseCode } = require("../components/response/response_code_store");
var {
  ExceptionType,
  createException,
  convertException,
} = require("../components/exception/exception_creator");
const { makeToken, tokenPayLoad, decodePayload } = require("../components/jwt");

var ModelToken = require("../models/model_token_store");

router.post("/refresh", auth.signCondition, async (req, res) => {
  const refresh = req.body.refreshToken;
  let savedToken = await ModelToken.findOne({ refreshToken: refresh }).exec();

  try {
    if (savedToken != null) {
      const tokenPayload = tokenPayLoad(req.decoded.id, req.decoded.joinType);
      const token = makeToken(tokenPayload);
      savedToken.token = token.token;
      savedToken.refreshToken = token.refreshToken;
      const result = await savedToken.save();

      res.json(response.success(result));
    } else {
      var error = createException(ExceptionType.EXFIRED_JWT_TOKEN);
      res.json(response.fail(error, error.errmsg, error.code));
    }
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});
module.exports = router;
