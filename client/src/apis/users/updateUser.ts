export default async function updateUser(
  userId: string | undefined,
  data: any
) {
  // Updating the known_words

  console.log(userId, data);
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(data);

  const requestOptions: any = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(
    `http://localhost:3000/api/users/update-user/${userId}`,
    requestOptions
  );

  const result = await response.json();
  console.log(result);
  return result;
}
