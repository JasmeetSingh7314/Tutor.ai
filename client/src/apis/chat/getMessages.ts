export const getMessages = async (userId: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/message/get-messages/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
