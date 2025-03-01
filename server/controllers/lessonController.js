const mongoose = require("mongoose");
const Material = require("../models/material");
const User = require("../models/user");

class LessonController {
  static async getNextLesson(req, res) {
    const userId = req.params.userId;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const materials = await Material.find({});
      let nextLesson = null;

      for (const material of materials) {
        for (const lesson of material.lesson) {
          if (!user.completedLessons.includes(lesson._id.toString())) {
            nextLesson = lesson;
            break;
          }
        }
        if (nextLesson) break;
      }

      // If no lessons are available, generate a new one dynamically
      if (!nextLesson) {
        const response = await axios
          .get //python api
          ();
        nextLesson = response.data;

        // Save the new lesson in MongoDB
        await Material.findOneAndUpdate(
          { createdBy: userId },
          { $push: { lesson: nextLesson } },
          { upsert: true, new: true }
        );
      }

      res.status(200).json({
        success: true,
        message: "Next lesson fetched successfully",
        lesson: nextLesson,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching next lesson",
        error: error.message,
      });
    }
  }

  // Mark a lesson as completed
  async markLessonAsCompleted(req, res) {
    const userId = req.params.userId;
    const { lessonID } = req.body;

    try {
      await User.findByIdAndUpdate(
        userId,
        { $push: { completedLessons: lessonID } },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Lesson marked as completed",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error marking lesson as completed",
        error: error.message,
      });
    }
  }
}

module.exports = LessonController;
