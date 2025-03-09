const axios = require("axios");
const TOKEN_ADDRESS = "0x253d66D58c6f1Df6A38A9a426aA037074bAb40bf";

//TUTOR ACTIONS
//FINDINTENT: call to find intent -> finding the intent behind the message
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

//GENERATE-TEXT: calls to chat and used for basic conversation
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

//GET-PROGRESS: getting a progress report from TUTOR
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

//GENERATE-LESSON: used for generating the next lesson for the user
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

///SONIC ACTIONS

//GET-BALANCE: calls to get-sonic-balance
const getBalance = async (address) => {
  try {
    const balanceBody = {
      connection: "tutor",
      action: "get-balance",
      params: [address, TOKEN_ADDRESS],
    };
    config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post(
      "http://localhost:8000/tutor/get-balance",
      balanceBody,
      config
    );
    const result = await response.data;
    return result;
  } catch (error) {
    console.log(error);
  }
};
//GET-REWARDS: calls to get-rewards
const getRewards = async (address, name, level, title) => {
  try {
    const balanceBody = {
      connection: "tutor",
      action: "get-rewards",
      params: [address, name, level, title],
    };
    config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post(
      "http://localhost:8000/tutor/get-rewards",
      balanceBody,
      config
    );
    const result = await response.data;
    return result;
  } catch (error) {
    console.log(error);
  }
};

//RETRY LOGIC
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
        throw new Error("Result is empty!");
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

//EXPORTING
module.exports = {
  findIntent,
  generateText,
  generateLesson,
  getProgress,
  getBalance,
  getRewards,
};
