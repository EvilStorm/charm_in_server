var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const AppVersionSchema = new Schema(
  {
    appVerCode: { type: Number, index: true },
    appVerName: { type: String },
    say: { type: String },
    os: { type: String },
    isMustUpdate: { type: Boolean, default: false },
    isShow: { type: Boolean, default: true },
    isDelete: { type: Boolean, default: false },
    deletedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("AppVersion", AppVersionSchema);
