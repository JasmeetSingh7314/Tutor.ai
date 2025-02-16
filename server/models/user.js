const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, match: /.+\@.+\..+/ },
    walletAddress: { type: String, unique: true, required: true },

    profileImage: { type: String, default: "/images/defaultImage.png" },
    preference: { type: String },
    targetLanguage: { type: String },
    levelOfFluencyInTargetLanguage: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    nativeLanguage: { type: String },
  },
  { timestamps: true }
);

const User = model("users", userSchema);

module.exports = User;
