export const getMaterial = async (user_id: string) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/material/get-material/${user_id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    return result;
  } catch (error) {
    console.error(error);
  }
};
