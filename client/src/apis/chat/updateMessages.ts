export const updateMessage = async (userID: string, messages: any) => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/message/update-messages",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID, messages }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to update messages:", error);
    throw error;
  }
};
