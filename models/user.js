const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true },
    walletAddress: { type: String, unique: true, required: true },

    profileImage: { type: String, default: "/images/defaultImage.png" },
    preference: { type: String },
    levelOfFluencyInTargetLanguage: { type: String },
    nativeLanguage: { type: string },
  },
  { timestamps: true }
);

const User = model("users", userSchema);

module.exports = User;
