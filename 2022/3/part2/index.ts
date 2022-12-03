import fs from "fs/promises";
import { sumNumberArray } from "../../../helpers";

async function main() {
  const data = await fs.readFile(`${__dirname}/../inputs.txt`, "utf-8");
  const lines = data.split("\n");
  console.log(lines);

  const commonChars: string[] = [];

  // Split each line into 2 arrays down the middle
  for (let i = 0; i < lines.length; i += 3) {
    const firstLine = lines[i].split("");
    const secondLine = lines[i + 1].split("");
    const thirdLine = lines[i + 2].split("");

    const commonChar = firstLine.find(
      (char) => secondLine.includes(char) && thirdLine.includes(char)
    );

    if (!commonChar) {
      throw new Error("No common char found between lines");
    }
    console.log(
      `The common char is ${commonChar} with a priority score of ${getScoreOfLetter(
        commonChar
      )}`
    );
    commonChars.push(commonChar);
  }
  const score = sumNumberArray(
    commonChars.map((char) => getScoreOfLetter(char))
  );

  // Output the total
  console.log(`The total score is ${score}`);
}

/** Calculate the priority score of a letter */
const getScoreOfLetter = (letter: string): number => {
  if (letter >= "a" && letter <= "z") {
    const min = "a".charCodeAt(0);
    const letterScore = letter.charCodeAt(0);
    return letterScore - min + 1;
  } else if (letter >= "A" && letter <= "Z") {
    const min = "A".charCodeAt(0);
    const letterScore = letter.charCodeAt(0);
    return letterScore - min + 1 + 26;
  }
  throw new Error("Unexpected letter");
};

main()
  .then(() => console.log("Finished running puzzle"))
  .catch((err) => console.error(err));
