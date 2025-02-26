const { Schema, model } = require("mongoose");

const materialSchema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "users" },
    lesson: [
      {
        _id: { type: Schema.Types.ObjectId, auto: true },
        lesson: { type: Object },
      },
    ],
    quiz: [{ type: Schema.Types.ObjectId, ref: "quiz" }],
  },
  { timestamps: true }
);

const Material = model("materials", materialSchema);

module.exports = Material;
