export const chat = async (message: string) => {
  try {
    const LessonbodyData = {
      connection: "tutor",
      action: "generate-lesson",
      params: ["Japanese", "Beginner", "[]"],
    };
    const bodyData = {
      connection: "sonic",
      action: "transfer",
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
      params: [
        message,
        "You are a language expert. Focusing on teaching languages in the simplest of manners.",
      ],
    };
    const response = await fetch("http://localhost:8000/openai/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Lesson created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating lesson:", error);
  }
};
