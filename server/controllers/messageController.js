const { findIntent, generateText } = require("../services/modelEndpoints");
const { generateLesson } = require("../services/modelEndpoints");
<<<<<<< HEAD
=======
const mongoose = require("mongoose");
>>>>>>> 916d86ae58b331cd5728bd2dc22a79291564282f

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

  async updateMessages(req, res) {
    const { userID, name, messages } = req.body;

    try {
      const newConversation = {
        id: new mongoose.Types.ObjectId(),
        name,
        messages,
      };
      const updatedUser = await this.User.findByIdAndUpdate(
        userID,
        {
          $push: { conversations: newConversation },
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({
          message: "user not found",
        });
      }

      res.status(201).json({
        success: true,
        message: "Conversation added successfully",
        data: updatedUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
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
