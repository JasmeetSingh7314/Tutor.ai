export const createLesson = async () => {
  const user_id = "67b1882de909cc845ae3257d";
  try {
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
