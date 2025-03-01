const { findIntent, generateText } = require("../services/modelEndpoints");
const { generateLesson } = require("../services/modelEndpoints");

class messageHandler {
  constructor(message) {}

  async messageIntent(req, res, id) {
    try {
      const { message } = req.body;

      console.log(message);
      const intent = await findIntent(message);

      console.log("THe intent is", intent);

      switch (intent.result) {
        case "lesson":
          const lesson_response = await generateLesson(
            "Japanese",
            "Beginner",
            "[]"
          );
          return res.send({
            success: true,
            intent: "lesson",
            message: "Lesson generated succesfully!",
            data: lesson_response.result,
          });
        case "word meanings":
          console.log("word-meaning");
        case "general":
          const baseResponse = await generateText(message, "Japanese");
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
  async saveMessages(req,res,id){
    const {messages}=req.body;

    

    



  }
}

module.exports = messageHandler;
