export const createQuiz = async (user_id: string) => {
  try {
    console.log(user_id);
    const response = await fetch("http://localhost:8000/create-quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user_id,
        lang: JSON.parse(localStorage.getItem("userDetails")).targetLanguage,
        level: JSON.parse(localStorage.getItem("userDetails")).priorExperience,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Quiz created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating quiz:", error);
  }
};
