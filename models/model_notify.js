var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema(
  {
    seq: { type: Number, index: true, unique: true },
    title: { type: String },
    say: { type: String },
    isAppStop: { type: Boolean, default: false },
    isImportant: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    deletedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Notify", schema);
