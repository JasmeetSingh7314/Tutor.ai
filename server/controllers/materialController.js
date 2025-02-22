// const { pythonResponse } = require("../services/pythonProxy");

class MaterialHandler {
  constructor(materialModel) {
    this.Material = materialModel;
  }

  async getMaterial(req, res, id, fieldName) {
    try {
      let projection = {};
      console.log("FieldName", fieldName);
      console.log("Id", id);
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
  // async createMaterial(req, res, id) {
  //   try {
  //     const { createdBy, lesson, quiz } = req.body;

  //     console.log("Hey!", createdBy, lesson, quiz);

  //     const checkExistingMaterial = await this.Material.findById(id);

  //     const newMaterial = await this.Material.create({
  //       createdBy,
  //       lesson: lesson,
  //       quiz: quiz,
  //     });

  //     const populatedMaterial = await this.Material.findById(
  //       newMaterial._id
  //     ).populate("createdBy", "fullName email walletAddress profileImage");
  //     res.status(201).json({
  //       success: true,
  //       message: "Material created successfully",
  //       data: populatedMaterial,
  //     });
  //   } catch (error) {
  //     res.status(500).json({ success: false, message: error.message });
  //   }
  // }
  async createMaterial(req, res, id) {
    try {
      const { createdBy, lesson, quiz } = req.body;

      console.log("Hey!", createdBy, lesson, quiz);

      const checkExistingMaterial = await this.Material.findById(id);

      if (checkExistingMaterial) {
        if (Array.isArray(lesson) && lesson.length > 0) {
          await this.Material.findByIdAndUpdate(
            id,
            {
              $push: { lesson: { $each: lesson } },
            },
            { new: true }
          );
        }

        if (Array.isArray(quiz) && quiz.length > 0) {
          await this.Material.findByIdAndUpdate(
            id,
            {
              $push: { quiz: { $each: quiz } },
            },
            { new: true }
          );
        }

        const updatedMaterial = await this.Material.findById(id).populate(
          "createdBy",
          "fullName email walletAddress profileImage"
        );

        return res.status(200).json({
          success: true,
          message: "Material updated successfully",
          data: updatedMaterial,
        });
      }

      const newMaterial = await this.Material.create({
        createdBy,
        lesson: lesson,
        quiz: quiz,
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
