const { Schema, model } = require("mongoose");

const progressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    tier: { type: String },
    lessonsCompleted: { type: Number, default: 0 },
    xpRequiredForNextLevel: { type: Number, default: 100 },
    rewardedLevels: [Number],
  },
  { timestamps: true }
);

const Progress = model("Progress", progressSchema);

module.exports = Progress;
