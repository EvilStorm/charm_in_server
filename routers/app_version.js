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
    const cursor = await ModelAppVersion.find()
      .select("appVerCode appVerName say os isMustUpdate ")
      .sort({ appVerCode: 1 })
      .lean()
      .exec();
    cursor.id = cursor._id;
    res.json(response.success(cursor));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

router.get("/latest", async (req, res) => {
  try {
    const cursor = await ModelAppVersion.findOne({
      isDelete: false,
      isShow: true,
    })
      .select("appVerCode appVerName say os isMustUpdate ")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.json(response.success(cursor));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

router.get("/:ver/:os", async (req, res) => {
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

router.get("/after/:ver/:os", async (req, res) => {
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
          appVerName: { $max: "$appVerName" },
          os: { $last: "$os" },
          say: { $last: "$say" },
          isMustUpdate: { $max: "$isMustUpdate" },
        },
      },
    ]).exec();

    res.json(response.success(cursor[0]));
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
    })
      .lean()
      .exec();

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
    })
      .lean()
      .exec();

    res.json(response.success(cursor));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

module.exports = router;
