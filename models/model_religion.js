var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema(
  {
    type: { type: String },
    info: { type: String },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Religion", schema);
