var express = require("express");
var router = express.Router();

const ModelUser = require("../models/model_user");
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
    const content = new ModelUser(req.body);
    const save = await content.save();

    res.json(response.success(save));
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
    }).populate("setting");

    res.json(response.success(cursor));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

module.exports = router;
