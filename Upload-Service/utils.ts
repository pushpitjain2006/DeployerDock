// never name a file utils , Its just a small project so I named it utils.ts

const MAX_ID_LENGTH = 10;
const SET_OF_CHARACTERS =
"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function generateRandomId() {
  let result = "";
  for (let i = 0; i < MAX_ID_LENGTH; i++) {
    result += SET_OF_CHARACTERS.charAt(
      Math.floor(Math.random() * SET_OF_CHARACTERS.length)
    );
  }
  return result;
}
