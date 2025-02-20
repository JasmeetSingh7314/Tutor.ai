const { Schema, model } = require("mongoose");

const materialSchema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "users" },
    dailyLessons: [{ type: String }],
    regularLessons: [{ type: String }],
    quizScore: [{ type: String }],
    lesson: [{ type: Object }],
  },
  { timestamps: true }
);

const Material = model("materials", materialSchema);

module.exports = Material;
