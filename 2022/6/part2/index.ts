import fs from "fs/promises";

const WINDOW_SIZE = 14;
async function main() {
  const data = await fs.readFile(`${__dirname}/../inputs.txt`, "utf-8");
  const stream = data.split("");

  for (let i = 0; i < stream.length; i++) {
    const window = stream.slice(i, i + WINDOW_SIZE);
    // Check if all chars in window are unique
    const uniqueChars = new Set(window);
    if (uniqueChars.size !== WINDOW_SIZE) continue;

    console.log("All chars are unique at index %o", i + window.length);
    return;
  }
}

main()
  .then(() => console.log("Finished running puzzle"))
  .catch((err) => console.error(err));
