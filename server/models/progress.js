const { default: mongoose } = require("mongoose");

const progress = mongoose.Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: "users" },
});
