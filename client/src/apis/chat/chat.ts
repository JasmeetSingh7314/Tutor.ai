export const chat = async (message: string, userId: string) => {
  try {
    const LessonbodyData = {
      connection: "tutor",
      action: "generate-lesson",
      params: ["Japanese", "Beginner", "[]"],
    };
    const bodyData = {
      connection: "sonic",
      action: "send-sonic",
      params: ["0x72e650E1AC8B24A168d6b53C4960801Ec36b2Dc0", "5"],
    };
    const twitterBodyData = {
      connection: "twitter",
      action: "post-tweet",
      params: ["Haiku huh..."],
    };
    const Data = {
      connection: "openai",
      action: "generate-text",
      params: [message, "Korean"],
    };
    // const intent_check = {
    //   connection: "openai",
    //   action: "find-intent",
    //   params: [message],
    // };
    const messageData = {
      message: message,
    };
    console.log(message);
    const response = await fetch(
      `http://localhost:3000/api/message/send-message/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Call successful!!:", data);
    return data;
  } catch (error) {
    console.error("Error creating lesson:", error);
  }
};
