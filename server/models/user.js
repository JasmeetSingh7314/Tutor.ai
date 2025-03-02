const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullName: { type: String },
    email: { type: String, unique: true, match: /.+\@.+\..+/ },
    walletAddress: { type: String, unique: true, required: true },
    profileImage: { type: String, default: "/images/defaultImage.png" },
    preference: { type: String },
    targetLanguage: { type: String },
    priorExperience: { type: String },
    nativeLanguage: { type: String },
    knownWords: [String],
    reviewWords: [String],
    weaknesses: [{ type: Object }],
    completedLessons: [{ type: String }],
    completedQuizzes: [{ type: Schema.Types.ObjectId, ref: "quiz" }],
    conversations: [
      {
        userQuestion: { type: String },
        aiAnswer: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const User = model("users", userSchema);

module.exports = User;
