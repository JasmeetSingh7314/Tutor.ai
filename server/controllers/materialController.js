// const { pythonResponse } = require("../services/pythonProxy");

class MaterialHandler {
  constructor(materialModel) {
    this.Material = materialModel;
  }

  async getMaterial(req, res, id) {
    try {
      // let projection = {};
      // console.log("FieldName", fieldName);
      // console.log("Id", id);
      // if (fieldName) {
      //   projection[fieldName] = 1;
      // }
      const lessonData = await this.Material.find({ createdBy: id });
      // .select(projection)
      // .lean();

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
      const { createdBy, lesson, quiz} = req.body;
      console.log(createdBy, lesson, quiz);

      // Check if material exists for the user
      const existingMaterial = await this.Material.findOne({ createdBy });

      // console.log(existingMaterial);

      if (existingMaterial) {
        // Prepare update fields
        const updateFields = {};

        // Append lessons if provided
        if (lesson) {
          updateFields.$push = { lesson: { lesson: lesson } };
        }
        console.log("UPDATE", updateFields);
        // Append quizzes if provided
        if (quiz) {
          updateFields.$push = { quiz: quiz };
        }

        console.log("Update fields:", updateFields);

        // Update the document if there are fields to update
        if (Object.keys(updateFields).length > 0) {
          await this.Material.updateOne({ createdBy }, updateFields);
        }

        // Fetch the updated document
        const updatedMaterial = await this.Material.findOne({
          createdBy,
        }).populate("createdBy", "fullName email walletAddress profileImage");

        return res.status(200).json({
          success: true,
          message: "Material updated successfully",
          data: updatedMaterial,
        });
      }

      // If material does not exist, create a new one
      const newMaterial = await this.Material.create({
        createdBy,
        lesson: Array.isArray(lesson) ? lesson : [], // Ensure lesson is an array
        quiz: Array.isArray(quiz) ? quiz : [], // Ensure quiz is an array
      });

      // Populate the createdBy field
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
}
module.exports = MaterialHandler;
