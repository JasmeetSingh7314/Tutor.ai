import { addLevel } from "./addLevel";

export const addProgress = async (
  userId: string,
  gainedXp: number,
  level: string
) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const xpRaw = JSON.stringify({
    userId: userId,
    xpEarned: gainedXp,
  });

  const xpRequestOptions: any = {
    method: "POST",
    headers: myHeaders,
    body: xpRaw,
    redirect: "follow",
  };
  try {
    const xpResponse = await fetch(
      "http://localhost:3000/api/progress/add-xp",
      xpRequestOptions
    );
    const xpResult = await xpResponse.json();
    if (xpResult.success) {
      const result = await addLevel(userId, level);
      return {
        success: true,
        levelResponse: result,
      };
    }

    console.log(xpResult);
  } catch (err) {
    console.error(err);
    throw new Error("Error in adding progress");
  }
};
