import { addProgress } from "./addProgress";
import { getProgress } from "./getProgress";
import getUser from "./getUser";

const XP_MULTIPLIER_PER_WORD = 200;

export default async function updateWords(userId: string, currentWords: any[]) {
  // Fetching previous known Words
  const walletAddress = localStorage.getItem("walletAddress") as string;
  //making the user call
  const user = await getUser(walletAddress);
  console.log(user);
  const prevWords = user.data.knownWords;

  //making the current words to be checked array
  let knownWords: string[] = [];

  knownWords = currentWords.map((element: any) => element.word_details.word);

  console.log("Current words are:", knownWords);

  let duplicates = 0;
  for (let i = 0; i < prevWords.length; i++) {
    for (let j = 0; j < knownWords.length; j++) {
      if (knownWords[j] === prevWords[i]) {
        duplicates++;
      }
    }
  }
  console.log("The duplicates are", duplicates);

  //Calculating the gained Xp
  //NOTE: XP_MULTIPLIER_PER_WORD can be changed to increase or decrease difficulty
  let gainedXp = 0;
  if (duplicates <= knownWords.length) {
    gainedXp = (knownWords.length - duplicates) * XP_MULTIPLIER_PER_WORD;
  } else if (duplicates > knownWords.length) {
    gainedXp = 0;
  }
  console.group("The gained xp is:", gainedXp);

  const finalArray = [...new Set([...prevWords, ...knownWords])];
  console.log(finalArray);
  //Setting the body
  const raw = JSON.stringify({
    knownWords: finalArray,
  });

  //Setting the headers
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const requestOptions: any = {
    method: "PUT",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const prevProgress = await getProgress(userId);

  const prevLevel = prevProgress?.data.level;

  console.log("Current level is:", prevLevel);

  //Making the call to update the knownWords
  const result = await fetch(
    `http://localhost:3000/api/users/update-user/${userId}`,
    requestOptions
  )
    .then((response) => {
      return response;
    })
    .then(async () => await addProgress(userId, gainedXp, prevLevel))
    .catch((error) => console.error(error));
  return {
    result: result,
    xp: gainedXp,
  };
}
