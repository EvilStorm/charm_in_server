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
    gender: { type: Number, default: 0 }, //0: 남자, 1: 여자
    nickName: { type: String, unique: true },
    comment: { type: String },
    image_url: { type: String },
    pushToken: { type: String },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("UserExtendInfo", schema);
