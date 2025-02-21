export default function updateUser() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    profileImage: "./updated",
    reviewWords: ["突破とっぱ", "先走さきばしる", "防衛ぼうえい"],
    knownWords: ["案内"],
    weaknesses: [
      {
        vocab: "you need to work on your vocab",
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    "http://localhost:3000/api/users/update-user/67b1882de909cc845ae3257d",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
