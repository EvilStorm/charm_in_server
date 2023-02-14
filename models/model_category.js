var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema(
  {
    category: { type: String, index: true },
    name: { type: String },
    isShow: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
    deletedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Category", schema);
