var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now, index: true },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("TodaySuper", schema);
