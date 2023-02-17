var express = require("express");
var router = express.Router();

const ModelUser = require("../models/model_user");
const ModelUserExtend = require("../models/model_user_extend");
const ModelSetting = require("../models/model_setting");
var response = require("../components/response/response_util");
var { ResponseCode } = require("../components/response/response_code_store");
var {
  ExceptionType,
  createException,
  convertException,
} = require("../components/exception/exception_creator");

module.exports = router;

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

    user.extendInfo = extend._id;
    user.setting = setting._id;

    res.json(response.success(user));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

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
