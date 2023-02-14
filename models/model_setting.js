var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    answerAlarm: { type: Boolean, default: true },
    systemAlarm: { type: Boolean, default: true },
    eventAlarm: { type: Boolean, default: true },
    nightEventAlarm: { type: Boolean, default: true },
    emailSend: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now, select: false },
    createdAt: { type: Date, default: Date.now, select: false },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("Setting", schema);
