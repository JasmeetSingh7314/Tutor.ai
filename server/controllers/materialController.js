class MaterialHandler {
  constructor(materialModel) {
    this.Material = materialModel;
  }

  async getMaterial(req, res, id) {
    try {
      const lessonData = await this.Material.find({ createdBy: id });

      const vocab = lessonData.data.lesson.vocab;
      // console.log(lessonData.lesson.vocab);
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
      const { createdBy, dailyLessons, regularLessons, quizScore, lesson } =
        req.body;
      const newMaterial = await this.Material.create({
        createdBy,
        dailyLessons,
        regularLessons,
        quizScore,
        lesson,
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
