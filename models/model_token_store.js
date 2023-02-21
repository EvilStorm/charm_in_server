var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema(
  {
    userId: { type: String, index: true },
    token: { type: String },
    refreshToken: { type: String },
    updateDateAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.userId;
        delete ret.updateDateAt;
      },
    },
  }
);

module.exports = mongoose.model("AuthToken", schema);
