export const getProgress = async (userId: string) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const xpRequestOptions: any = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  try {
    const xpResponse = await fetch(
      `http://localhost:3000/api/progress/get-progress/${userId}`,
      xpRequestOptions
    );
    const xpResult = await xpResponse.json();
    console.log(xpResult);
    return xpResult;
  } catch (err) {
    console.error(err);
    throw new Error("Error in fetching progress");
  }
};
