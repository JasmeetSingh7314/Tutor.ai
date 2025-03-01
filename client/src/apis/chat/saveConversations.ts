export const chat = async (message: string, system: string) => {
  try {
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
      "http://localhost:3000/api/message/send-message",
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
