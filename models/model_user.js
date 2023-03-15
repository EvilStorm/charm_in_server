var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      index: true,
    },
    gender: { type: Number, default: 0 }, //0: 남자, 1: 여자
    nickName: { type: String, default: null },
    say: { type: String, default: null },
    height: { type: Number, default: null },
    birthDay: { type: Date, default: null },
    religion: { type: Schema.Types.ObjectId, ref: "Religion" },
    mbti: { type: Schema.Types.ObjectId, ref: "MBTI" },
    image_url: { type: String, default: null },
    pushToken: { type: String, default: null },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("User", schema);
