var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
const ModelUser = require("../models/model_user");
const ModelUserExtend = require("../models/model_user_extend");
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
    const userModel = new ModelUser(req.body);
    const user = await userModel.save();

    let extend = new ModelUserExtend();
    extend.owner = user._id;
    await extend.save();

    let setting = new ModelSetting();
    setting.owner = user._id;
    await setting.save();

    console.log(`extend._id: ${extend._id}`);
    console.log(`setting._id: ${setting._id}`);
    user.extendInfo = extend._id;
    user.setting = setting._id;
    await user.save();

    res.json(response.success(user));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

router.post("/signIn", async (req, res) => {
  try {
    const user = await ModelUser.findOne({ firebaseId: req.body.firebaseId })
      .populate("extendInfo", "-owner -updatedAt")
      .populate("setting", "-owner")
      .lean()
      .exec();

    const jetToken = await saveAuthToken(user._id, user.joinType);
    var result = { ...user, authToken: { ...jetToken } };

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

    const userModel = await ModelUser.findById(req.decoded.id)
      .populate("extendInfo", "-owner -updatedAt")
      .populate("setting", "-owner")
      .lean()
      .exec();

    const jwtToken = await saveAuthToken(userModel._id, userModel.joinType);
    var result = { ...userModel, authToken: { ...jwtToken } };

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

router.get("/:_id", async (req, res) => {
  try {
    var cursor = await ModelUser.findOne({
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

router.patch("/:_id", async (req, res) => {
  try {
    const user = await ModelUser.findById(req.params._id)
      .populate("extendInfo")
      .lean()
      .exec();
    console.log(user);

    // var cursor = await ModelUserExtend.findByIdAndUpdate(
    //   user.extendInfo._id,
    //   req.body
    // ).exec();

    res.json(response.success(user));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

module.exports = router;
