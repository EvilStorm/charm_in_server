var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema(
  {
    firebaseId: { type: String, index: true, unique: true },
    email: { type: String, index: true },
    joinType: { type: Number, default: 0 }, //0: 회원가입, 1:구글, 2: 카카오, 3: 페이스북, 4: 애플
    secureLevel: { type: Number, default: 0 }, //0: 일반, 6: 관리자, 9: 모든 권한
    gender: { type: Number, default: 0 }, //0: 남자, 1: 여자
    extendInfo: {
      type: Schema.Types.ObjectId,
      ref: "UserExtendInfo",
      unique: true,
    },
    setting: { type: Schema.Types.ObjectId, ref: "Setting", default: null },
    isDelete: { type: Boolean, default: false },
    deletedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("User", schema);
