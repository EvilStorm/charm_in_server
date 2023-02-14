var express = require("express");
var router = express.Router();

var ModelAppVersion = require("../models/model_app_version");
var response = require("../components/response/response_util");

var auth = require("../components/auth");
var { ResponseCode } = require("../components/response/response_code_store");
var {
  ExceptionType,
  createException,
  convertException,
} = require("../components/exception/exception_creator");

router.post("", auth.isAdmin, async (req, res) => {
  try {
    const model = new ModelAppVersion(req.body);
    const cursor = await model.save();

    res.json(response.success(cursor));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

router.get("/", auth.isAdmin, async (req, res) => {
  try {
    const cursor = await ModelAppVersion.find().sort({ appVerCode: 1 }).exec();

    res.json(response.success(cursor));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

router.get("/:ver", async (req, res) => {
  try {
    const cursor = await ModelAppVersion.aggregate([
      {
        $match: {
          $and: [
            {
              appVerCode: Number(req.params.ver),
            },
            { isShow: true },
          ],
        },
      },
    ]).exec();

    res.json(response.success(cursor));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

router.get("/after/:ver", async (req, res) => {
  try {
    const cursor = await ModelAppVersion.aggregate([
      {
        $match: {
          $and: [
            {
              appVerCode: { $gt: Number(req.params.ver) },
            },
            { isShow: true },
          ],
        },
      },
      {
        $group: {
          _id: null,
          appVerCode: { $max: "$appVerCode" },
          say: { $last: "$say" },
          isMustUpdate: { $max: "$isMustUpdate" },
        },
      },
    ]).exec();

    res.json(response.success(cursor));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

router.patch("/:_id", auth.isAdmin, async (req, res) => {
  try {
    const cursor = await ModelAppVersion.findByIdAndUpdate(req.params._id, {
      $set: req.body,
    }).exec();

    res.json(response.success(cursor));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

router.delete("/:_id", auth.isAdmin, async (req, res) => {
  //isDelete
  //deletedAt
  try {
    const cursor = await ModelAppVersion.findByIdAndUpdate(req.params._id, {
      $set: req.body,
    }).exec();

    res.json(response.success(cursor));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

module.exports = router;
