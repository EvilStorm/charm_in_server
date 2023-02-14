var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema(
  {
    userId: { type: String, index: true, unique: true },
    token: { type: String },
    refreshToken: { type: String },
    updateDateAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("AuthToken", schema);
