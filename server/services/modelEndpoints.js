const axios = require("axios");
const findIntent = async (message) => {
  try {
    const intent_check = {
      connection: "openai",
      action: "find-intent",
      params: [message],
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await makeRequestWithRetry(
      "http://localhost:8000/tutor/generate-intent",
      intent_check
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};
const generateText = async (message, user, conversation) => {
  try {
    const hello = "hello";

    const conversationStr = JSON.stringify(conversation);
    const generalReply = {
      connection: "openai",
      action: "generate-text",
      params: [message, JSON.stringify(user), conversationStr],
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await makeRequestWithRetry(
      "http://localhost:8000/tutor/chat",
      generalReply
    );

    return response;
  } catch (error) {
    console.log(error);
  }
};
const getProgress = async (message, user, progress) => {
  try {
    const generalReply = {
      connection: "openai",
      action: "generate-text",
      params: [message, JSON.stringify(user), JSON.stringify(progress)],
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await makeRequestWithRetry(
      "http://localhost:8000/tutor/progress",
      generalReply
    );

    return response;
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
      "http://localhost:8000/tutor/generate-lesson",
      lesson,
      config
    );
    const result = await response.data;
    return result;
  } catch (error) {
    console.log(error);
  }
};

async function makeRequestWithRetry(
  url,
  data,
  maxRetries = 3,
  retryDelay = 1000
) {
  let retryCount = 0;

  while (retryCount < maxRetries) {
    try {
      // Make the request
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the intent field is empty
      if (response.data.result === "") {
        throw new Error("Intent field is empty");
      }

      // If intent field is not empty, return the response
      return response.data;
    } catch (error) {
      retryCount++;

      // Log the error and retry
      console.error(`Attempt ${retryCount} failed: ${error.message}`);

      if (retryCount >= maxRetries) {
        throw new Error("Max retries reached");
      }

      // Wait for a delay before retrying
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
}
module.exports = {
  findIntent,
  generateText,
  generateLesson,
  getProgress,
};
