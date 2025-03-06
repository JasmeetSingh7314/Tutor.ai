export const addProgress = async (userId: string, gainedXp: number) => {
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
    return xpResult;
    console.log(xpResult);
  } catch (err) {
    console.error(err);
    throw new Error("Error in adding progress");
  }
};
