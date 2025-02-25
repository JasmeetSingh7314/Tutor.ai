export default async function getUser(walletAddress: string) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions: any = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const response = await fetch(
    `http://localhost:3000/api/users/get-user/${walletAddress}`,
    requestOptions
  );

  const result = await response.json();
  console.log(result);
  return result;
}
