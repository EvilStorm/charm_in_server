var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", index: true },
    target: { type: Schema.Types.ObjectId, ref: "User", index: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", index: true },
    answer: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Anwser", schema);
