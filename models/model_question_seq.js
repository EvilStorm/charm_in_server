var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", index: true },
    seq: { type: Number },
    qusetion: [{ type: Schema.Types.ObjectId, ref: "Question", index: true }],
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Question", schema);
