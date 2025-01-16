const MAX_ID_LENGTH = 10;
const CHARACTER_SET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

/**
 * Generates a random ID of a fixed length.
 * @returns A randomly generated string of length MAX_ID_LENGTH.
 */
export function generateRandomId(): string {
  let result = "";
  const characterSetLength = CHARACTER_SET.length;

  for (let i = 0; i < MAX_ID_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * characterSetLength);
    result += CHARACTER_SET.charAt(randomIndex);
  }

  return result;
}