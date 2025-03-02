const { findIntent, generateText } = require("../services/modelEndpoints");
const { generateLesson } = require("../services/modelEndpoints");

class messageHandler {
  constructor(userModel, materialModel) {
    this.User = userModel;
    this.Material = materialModel;
  }

  async messageIntent(req, res) {
    try {
      const id = req.params.id;
      const { message } = req.body;

      const intent = await findIntent(message);

      console.log("THe intent is", intent);

      const user = await this.User.findById(id);
      switch (intent.result) {
        case "lesson":
          const lesson_response = await generateLesson(
            user.targetLanguage,
            user.priorExperience,
            user.knownWords
          );

          // const userId = user._id;
          // const existingMaterial = await this.Material.findOne({ userId });
          // if (existingMaterial) {
          //   const updateFields = {};

          //   if (lesson) {
          //     updateFields.$push = { lesson: { lesson: lesson } };
          //   }
          // }
          // if (Object.keys(updateFields).length > 0) {
          //   await this.Material.updateOne({ userId }, updateFields);
          // }

          return res.send({
            success: true,
            intent: "lesson",
            message: "Todays lesson loading....",
            data: lesson_response.result,
          });
        case "word meanings":
          console.log("word-meaning");
        case "general":
          const baseResponse = await generateText(message, user.targetLanguage);
          return res.send({
            success: true,
            intent: intent,
            message: baseResponse.result,
          });
      }
    } catch (err) {
      console.log(err);
    }
  }
  async createConversation(req, res, id) {
    const { messages } = req.body;

    const findUser = await this.User.findOne(id);

    if (findUser) {
      const savemessage = await this.User.create(id, {});
    }
  }
  async getConvos(req, res, id) {}
  async updateConvos(req, res, id) {
    const { messages } = req.body;

    const findUser = await this.User.findById(id);

    if (findUser) {
      await this.User.updateOne(id, {});
    }
  }
}

module.exports = messageHandler;
