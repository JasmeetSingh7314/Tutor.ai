const { Schema, model } = require("mongoose");

const materialSchema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "users" },
    lesson: [{ type: Object }],
    quiz: [{ type: Object }],
  },
  { timestamps: true }
);

const Material = model("materials", materialSchema);

module.exports = Material;
