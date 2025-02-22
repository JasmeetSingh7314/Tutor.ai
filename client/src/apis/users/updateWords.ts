export default function updateWords(
  userId: string,
  field: string,
  currentWords: any[]
) {
  // Updating the known_words
  let knownWords: string[] = [];

  if (field === "knownWords") {
    knownWords = currentWords.map((element: any) => element.word_details.word);
  }

  console.log(knownWords, currentWords);

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    profileImage: "./updated",
    reviewWords: ["突破とっぱ", "先走さきばしる", "防衛ぼうえい"],
    knownWords: knownWords,
    weaknesses: [
      {
        vocab: "you need to work on your vocab",
      },
    ],
  });

  const requestOptions: any = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(`http://localhost:3000/api/users/update-user/${userId}`, requestOptions)
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
