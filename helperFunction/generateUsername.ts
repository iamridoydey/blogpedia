export function generateUsername(firstname: string){
  // Convert the name to lowercase
  const baseName = firstname.toLocaleLowerCase().replace(/[^a-z0-9]/g, "");

  // Generate a unique part 
  const uniquepart = Math.random().toString(36).substring(2, 8);

  const username = baseName + uniquepart;

  return username;
}