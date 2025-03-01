const { Schema, model } = require("mongoose");

const quizSchema = new Schema(
  {
    quizID: { type: Schema.Types.ObjectId, ref: "materials" },
    lessonID: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETE"],
      default: "PENDING",
    },
    metadata: { type: Object },
    resgiult: { type: Object },
  },
  { timestamps: true }
);

const Quiz = model("quiz", quizSchema);

module.exports = Quiz;
