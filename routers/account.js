var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
const AccountModel = require("../models/model_account");
const UserModel = require("../models/model_user");
const ModelSetting = require("../models/model_setting");
const ModelAuthToken = require("../models/model_token_store");
var response = require("../components/response/response_util");
var { ResponseCode } = require("../components/response/response_code_store");
var {
  ExceptionType,
  createException,
  convertException,
} = require("../components/exception/exception_creator");
const { makeToken, tokenPayLoad } = require("../components/jwt");
const auth = require("../components/auth");

router.post("", async (req, res) => {
  try {
    const accountModel = new AccountModel(req.body);
    const account = await accountModel.save();

    let userModel = new UserModel();
    userModel.owner = account._id;
    await userModel.save();

    let setting = new ModelSetting();
    setting.owner = account._id;
    await setting.save();

    console.log(`userModel._id: ${userModel._id}`);
    console.log(`setting._id: ${setting._id}`);
    account.userInfo = userModel._id;
    account.setting = setting._id;
    await account.save();

    res.json(response.success(account));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

router.post("/signIn", async (req, res) => {
  try {
    const account = await AccountModel.findOne({
      firebaseId: req.body.firebaseId,
    })
      .populate("userInfo", "-owner -updatedAt")
      .populate("setting", "-owner")
      .lean()
      .exec();

    const jetToken = await saveAuthToken(account._id, account.joinType);
    var result = { ...account, authToken: { ...jetToken } };

    res.json(response.success(result));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

router.post("/signIn/token", auth.isSignIn, async (req, res) => {
  try {
    console.log(req.decoded);
    console.log(req.decoded.id);

    const accountModel = await AccountModel.findById(req.decoded.id)
      .populate("userInfo", "-owner -updatedAt")
      .populate("setting", "-owner")
      .lean()
      .exec();

    const jwtToken = await saveAuthToken(
      accountModel._id,
      accountModel.joinType
    );
    var result = { ...accountModel, authToken: { ...jwtToken } };

    res.json(response.success(result));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

async function saveAuthToken(userId, joinType) {
  const payload = tokenPayLoad(userId, joinType);
  const jwtToken = makeToken(payload);

  let cursor = await ModelAuthToken.findOne({ userId: userId });

  if (cursor != null) {
    cursor.token = jwtToken.token;
    cursor.refreshToken = jwtToken.refreshToken;
    const result = await cursor.save();
    return result.toJSON();
  }

  let token = new ModelAuthToken();
  token.userId = userId;
  token.token = jwtToken.token;
  token.refreshToken = jwtToken.refreshToken;
  const tokenResult = await token.save();

  return tokenResult.toJSON();
}

router.get("/find/firebaseId/:firebaseId", async (req, res) => {
  try {
    const result = await AccountModel.findOne({
      firebaseId: req.params.firebaseId,
    })
      .lean()
      .exec();

    res.json(response.success(result));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

router.get("/:_id", async (req, res) => {
  try {
    var cursor = await AccountModel.findOne({
      _id: req.params._id,
    })
      .populate("setting")
      .lean()
      .exec();

    res.json(response.success(cursor));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

router.patch("", auth.isSignIn, async (req, res) => {
  console.log(req.decoded.id);
  console.log(req.body);
  try {
    var cursor = await AccountModel.findByIdAndUpdate(
      req.decoded.id,
      req.body
    ).exec();

    console.log(cursor);
    res.json(response.success(cursor));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

module.exports = router;
