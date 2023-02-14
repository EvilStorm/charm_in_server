var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User", index: true },
    qusetion: { type: String },
    type: { type: Number }, //0: 주관식, 1: 객관식, 2: 다중선택
    image_url: { type: String },
    isTemplate: { type: Boolean },
    bogy: [{ type: Schema.Types.ObjectId, ref: "Bogy" }],
    category: [{ type: Schema.Types.ObjectId, ref: "Category", index: true }],
    delete: { type: Boolean, default: false },
    deletedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Question", schema);
