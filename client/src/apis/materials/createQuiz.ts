export const createQuiz = async (
  lessonId: string,
  userId: string,
  lessonData: any
) => {
  try {
    console.log(userId, userId, lessonData);
    const response = await fetch("http://localhost:8000/create-quiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        lesson_id: lessonId,
        lang: JSON.parse(localStorage.getItem("userDetails")).targetLanguage,
        level: JSON.parse(localStorage.getItem("userDetails")).priorExperience,
        data: lessonData.vocab,
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
