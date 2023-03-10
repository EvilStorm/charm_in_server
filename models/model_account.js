var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema(
  {
    firebaseId: { type: String, index: true, unique: true },
    email: { type: String, index: true },
    emailValification: { type: Boolean, default: false },
    joinType: { type: Number, default: 0 }, //0: 회원가입, 1:구글, 2: 카카오, 3: 페이스북, 4: 애플
    secureLevel: { type: Number, default: 0 }, //0: 일반, 6: 관리자, 9: 모든 권한
    setting: { type: Schema.Types.ObjectId, ref: "Setting", default: null },
    userInfo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isDelete: { type: Boolean, default: false },
    deletedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Account", schema);
