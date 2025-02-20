// const { pythonResponse } = require("../services/pythonProxy");

class MaterialHandler {
  constructor(materialModel) {
    this.Material = materialModel;
  }

  async getMaterial(req, res, id, fieldName) {
    try {
      let projection = {};
      if (fieldName) {
        projection[fieldName] = 1; 
      }
      const lessonData = await this.Material.find({ createdBy: id })
        .select(projection)
        .lean();

      res.status(201).json({
        success: true,
        message: "Material successfully fetched",
        data: lessonData,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
  async createMaterial(req, res) {
    try {
      const {
        createdBy,
        dailyLessons,
        regularLessons,
        quizScore,
        lesson,
        quiz,
      } = req.body;

      console.log(
        "Hey!",
        createdBy,
        dailyLessons,
        regularLessons,
        quizScore,
        lesson,
        quiz
      );

      // const generated_lesson = pythonResponse;

      const newMaterial = await this.Material.create({
        createdBy,
        dailyLessons,
        regularLessons,
        quizScore,
        lesson: lesson,
      });

      const populatedMaterial = await this.Material.findById(
        newMaterial._id
      ).populate("createdBy", "fullName email walletAddress profileImage");
      res.status(201).json({
        success: true,
        message: "Material created successfully",
        data: populatedMaterial,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = MaterialHandler;
