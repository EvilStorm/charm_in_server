var express = require("express");
var router = express.Router();

var ModelNotify = require("../models/model_notify");
var response = require("../components/response/response_util");
var { ResponseCode } = require("../components/response/response_code_store");
var {
  ExceptionType,
  createException,
  convertException,
} = require("../components/exception/exception_creator");

const PAGE_COUNT = 30;

router.post("", async (req, res) => {
  try {
    const lastNotify = await ModelNotify.findOne({}).sort({ seq: -1 }).exec();

    let count = 0;
    if (lastNotify != null) {
      count = lastNotify.seq;
    }

    const content = new ModelNotify(req.body);
    content.seq = count + 1;

    const save = await content.save();

    res.json(response.success(save));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

router.get("/", async (req, res) => {
  try {
    const cursor = await ModelNotify.where().sort({ seq: -1 }).lean().exec();

    res.json(response.success(cursor));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

router.get("/:seq", async (req, res) => {
  try {
    const cursor = await ModelNotify.where({
      $and: [{ show: true }, { seq: Number(req.params.seq) }],
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

router.get("/page/:page", async (req, res) => {
  try {
    const cursor = await ModelNotify.where({ show: true })
      .sort({ createdAt: -1 })
      .skip(PAGE_COUNT * req.params.page)
      .limit(PAGE_COUNT)
      .lean()
      .exec();

    res.json(response.success(cursor));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

router.get("/count/:count", async (req, res) => {
  try {
    const cursor = await ModelNotify.where({ show: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(req.params.count))
      .lean()
      .exec();

    res.json(response.success(cursor));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

router.get("/main/:seq", async (req, res) => {
  try {
    const cursor = await ModelNotify.where({
      $and: [
        { seq: { $gt: req.params.seq } },
        { $or: [{ appStop: true }, { important: true }] },
        { show: true },
      ],
    })
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

router.patch("/:_id", async (req, res) => {
  try {
    const cursor = await ModelNotify.findOneAndUpdate(
      { _id: req.params._id },
      { $set: req.body }
    )
      .lean()
      .exec();

    res.json(response.success(cursor));
  } catch (e) {
    console.log(e);
    var error = convertException(e);
    res.json(response.fail(error, error.errmsg, error.code));
  }
});

router.delete("/:_id", async (req, res) => {
  try {
    const cursor = await ModelNotify.findOneAndUpdate(
      { _id: req.params._id },
      { $set: { delete: false } }
    )
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
