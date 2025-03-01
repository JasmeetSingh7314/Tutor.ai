const User = require("./../models/user");
const Quiz = require("./../models/quiz");
const axios = require("axios");

class QuizController {
  // Fetch the next uncompleted quiz or generate a new one
  static async getNextQuiz(req, res) {
    const userId = req.params.userId;

    try {
      // Fetch the user's completed quizzes
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // Fetch all pending quizzes
      const quizzes = await Quiz.find({ status: "PENDING" });
      let nextQuiz = null;

      for (const quiz of quizzes) {
        if (!user.completedQuizzes.includes(quiz._id.toString())) {
          nextQuiz = quiz;
          break;
        }
      }

      // If no quizzes are available, generate a new one dynamically
      if (!nextQuiz) {
        //python api
        const response = await axios.get("http://localhost:8000/generate-quiz");
        nextQuiz = response.data;

        // Save the new quiz in MongoDB
        const quizDocument = new Quiz({
          quizID: nextQuiz.quizID,
          lessonID: nextQuiz.lessonID,
          status: "PENDING",
          metadata: nextQuiz.metadata,
          result: nextQuiz.result,
        });
        await quizDocument.save();
      }

      res.status(200).json({
        success: true,
        message: "Next quiz fetched successfully",
        quiz: nextQuiz,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching next quiz",
        error: error.message,
      });
    }
  }

  // Mark a quiz as completed
  static async markQuizAsCompleted(req, res) {
    const userId = req.params.userId;
    const { quizID } = req.body;

    try {
      await User.findByIdAndUpdate(
        userId,
        { $push: { completedQuizzes: quizID } },
        { new: true }
      );

      // Update the quiz status to "COMPLETE"
      await Quiz.findByIdAndUpdate(
        quizID,
        { status: "COMPLETE" },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Quiz marked as completed",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error marking quiz as completed",
        error: error.message,
      });
    }
  }
}

module.exports = QuizController;
