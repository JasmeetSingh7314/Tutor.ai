export const updateMaterial = async (
  user_id: string,
  lesson: any,
  quiz: any
) => {
  try {
    console.log(user_id);
    const response = await fetch(
      "http://localhost:3000/api/material/create-material",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          createdBy: user_id,
          lesson: lesson,
        }),
      }
    );
    if (response.ok) {
      const nftResponse = await fetch(
        "http://localhost:3000/api/progress/get-lesson-nft",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user_id,
            title: "lesson generated",
          }),
        }
      );
      console.log("NFT generation:", nftResponse);
    }
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
