export const createLesson = async (user_id: string) => {
  try {
    console.log(user_id);
    const response = await fetch("http://localhost:8000/create-lesson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user_id,
      }),
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
