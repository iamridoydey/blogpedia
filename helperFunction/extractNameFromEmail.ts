export function extractNameFromEmail(email: string){
  // split the email by @ to get the local part
  const localPart = email.split("@")[0];

  // Find the digit index
  const firstDigitIndex = localPart.search("/\d/");

  // If there is a digit, cut off the part from the digit
  const localWithoutNumbers = firstDigitIndex !== - 1 ? localPart.slice(0, firstDigitIndex) : localPart;

  // If there is a dot betweeen firstname and last name then split by .
  const name = localWithoutNumbers.split(".");
  const formatName = name[0].charAt(0).toUpperCase() + name[0].slice(1).toLowerCase()

  return formatName;
}