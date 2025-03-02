export default async function updateWords(userId: string, currentWords: any[]) {
  // Updating the known_words
  let knownWords: string[] = [];

  knownWords = currentWords.map((element: any) => element.word_details.word);

  console.log(knownWords);
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    knownWords: knownWords,
  });

  const requestOptions: any = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  await fetch(`http://localhost:3000/api/users/update-user/${userId}`, requestOptions)
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
