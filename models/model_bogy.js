var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema(
  {
    question: { type: Schema.Types.ObjectId, ref: "Question", index: true },
    bogy: { type: String },
    order: { type: Number },
    isDelete: { type: Boolean, default: false },
    deletedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Bogy", schema);
