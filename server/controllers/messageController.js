const {
  findIntent,
  generateText,
  getProgress,
} = require("../services/modelEndpoints");
const { generateLesson } = require("../services/modelEndpoints");
const mongoose = require("mongoose");

class messageHandler {
  constructor(userModel, materialModel, progressModel) {
    this.User = userModel;
    this.Material = materialModel;
    this.Progress = progressModel;
  }

  async messageIntent(req, res) {
    try {
      const id = req.params.id;
      const { message } = req.body;

      const intent = await findIntent(message);

      if (intent.result) console.log("THe intent is", intent);

      const user = await this.User.findById(id);
      const progress = await this.Progress.findOne({ userId: id });
      console.log("progress is: ", progress);
      switch (intent.result) {
        case "lesson":
          const lesson_response = await generateLesson(
            user.targetLanguage,
            user.priorExperience,
            user.knownWords
          );

          return res.send({
            success: true,
            intent: "lesson",
            message: lesson_response.result.summary,
            data: lesson_response.result.unique_cards,
          });
        case "word meanings":
          console.log("word-meaning");
        case "general":
          const baseResponse = await generateText(
            message,
            user,
            user.conversations
          );
          return res.send({
            success: true,
            intent: intent,
            message: baseResponse.result,
          });
        case "progress":
          const report = await getProgress(message, user, progress);
          return res.send({
            success: true,
            intent: intent,
            message: report.result,
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

  async addConversation(req, res) {
    const { userID, messages } = req.body;

    try {
      const userInfo = await this.User.findById(userID);

      if (!userInfo) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      userInfo.conversations.push(messages);

      const updatedUser = await userInfo.save();

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

  async getConversations(req, res) {
    const { id } = req.params;

    try {
      const user = await this.User.findById(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Conversations retrieved successfully",
        data: user.conversations,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  async updateConvos(req, res, id) {
    const { messages } = req.body;

    const findUser = await this.User.findById(id);

    if (findUser) {
      await this.User.updateOne(id, {});
    }
  }
}

module.exports = messageHandler;
