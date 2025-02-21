import { sampleData } from "../../lib/sampleData";
export default function updateUser(field: string) {

  // Updating the known_words
  let knownWords: string[] = [];
  if (field === "knownWords") {
    knownWords = sampleData.vocab.map(
      (element: any) => element.word_details.word
    );
  }

  console.log(knownWords);
  
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
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch(
    "http://localhost:3000/api/users/update-user/67b742bb08ae429a5ca02a8d",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
