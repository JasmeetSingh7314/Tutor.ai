const axios = require("axios");
const findIntent = async (message) => {
  try {
    const intent_check = {
      connection: "openai",
      action: "find-intent",
      params: [message],
    };
    config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(
      "http://localhost:8000/tutor/action",
      intent_check,
      config
    );
    const result = await response.data;
    return result;
  } catch (error) {
    console.log(error);
  }
};
const generateText = async (message, language) => {
  try {
    const generalReply = {
      connection: "openai",
      action: "generate-text",
      params: [message, language],
    };
    config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(
      "http://localhost:8000/tutor/action",
      generalReply,
      config
    );
    const result = await response.data;
    return result;
  } catch (error) {
    console.log(error);
  }
};

const generateLesson = async (language, level, knownWords) => {
  try {
    const knownWordsString = knownWords.join(" ");

    const lesson = {
      connection: "tutor",
      action: "generate-lesson",
      params: [language, level, knownWordsString],
    };
    config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post(
      "http://localhost:8000/tutor/action",
      lesson,
      config
    );
    const result = await response.data;
    return result;
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  findIntent,
  generateText,
  generateLesson,
};
