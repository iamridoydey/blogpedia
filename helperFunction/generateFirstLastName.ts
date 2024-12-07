export const generateFirstLastName = (fullname: string): [string, string] => {
  // Turn fullname into an array
  const fullNameArray = fullname.split(" ");

  const firstName = fullNameArray.slice(0, fullNameArray.length - 1).join(" ");
  const lastName = fullNameArray[fullNameArray.length - 1] || " ";

  return [firstName, lastName];
};