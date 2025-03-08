const TOKEN_ADDRESS = "0x253d66D58c6f1Df6A38A9a426aA037074bAb40bf";
export const getBalance = async (walletAddress: string) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  const balanceBody = {
    connection: "tutor",
    action: "get-balance",
    params: [walletAddress, TOKEN_ADDRESS],
  };
  const balanceConfig: any = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow",
    body: JSON.stringify(balanceBody),
  };
  try {
    const response = await fetch(
      `http://localhost:8000/tutor/get-balance`,
      balanceConfig
    );
    const result = await response.json();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Error in fetching progress");
  }
};
