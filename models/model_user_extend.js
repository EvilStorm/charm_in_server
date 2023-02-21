var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    gender: { type: Number, default: 0 }, //0: 남자, 1: 여자
    nickName: { type: String, default: null },
    comment: { type: String, default: null },
    image_url: { type: String, default: null },
    pushToken: { type: String, default: null },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("UserExtendInfo", schema);
