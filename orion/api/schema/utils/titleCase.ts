function titleCase(str: string): string {
  let string = str.toLowerCase().split(" ");
  for (let i = 0; i < string.length; i++) {
    string[i] = string[i].charAt(0).toUpperCase() + string[i].slice(1);
  }
  return string.join(" ");
}

export default titleCase;
