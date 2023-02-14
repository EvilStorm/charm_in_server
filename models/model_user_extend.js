var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      index: true,
    },
    nickName: { type: String, unique: true },
    image_url: { type: String },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("UserExtendInfo", schema);
