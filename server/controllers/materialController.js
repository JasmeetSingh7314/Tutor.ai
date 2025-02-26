// const { pythonResponse } = require("../services/pythonProxy");

class MaterialHandler {
  constructor(materialModel) {
    this.Material = materialModel;
  }

  async getMaterial(req, res, id) {
    try {
      const lessonData = await this.Material.find({ createdBy: id });

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
      const { createdBy, lesson, quiz } = req.body;

      const existingMaterial = await this.Material.findOne({ createdBy });

      if (existingMaterial) {
        console.log("user already exists");
      }

      const newMaterial = await this.Material.create({
        createdBy,
        lesson: Array.isArray(lesson) ? lesson : [],
        quiz: Array.isArray(quiz) ? quiz : [],
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
  async updateMaterial(req, res) {
    try {
      const { createdBy, lesson, quiz } = req.body;

      const existingMaterial = await this.Material.findOne({ createdBy });

      if (existingMaterial) {
        const updateFields = {};

        if (lesson) {
          updateFields.$push = { lesson: { lesson: lesson } };
        }
        console.log("UPDATE", updateFields);

        if (quiz) {
          updateFields.$push = { quiz: quiz };
        }

        console.log("Update fields:", updateFields);

        if (Object.keys(updateFields).length > 0) {
          await this.Material.updateOne({ createdBy }, updateFields);
        }

        const updatedMaterial = await this.Material.findOne({
          createdBy,
        }).populate("createdBy", "fullName email walletAddress profileImage");

        return res.status(200).json({
          success: true,
          message: "Material updated successfully",
          data: updatedMaterial,
        });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
module.exports = MaterialHandler;
