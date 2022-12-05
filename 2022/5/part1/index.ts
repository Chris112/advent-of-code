import fs from "fs/promises";

async function main() {
  const data = await fs.readFile(`${__dirname}/../inputs.txt`, "utf-8");
  const lines = data.split("\n");
  //   console.log("Raw lines: %o", lines);

  // Get initial stacks
  const initialStacks = getInitialStacks(lines);

  // Determine number of stacks in pizzle
  const numberOfStacks = findNumberOfStacks(initialStacks);
  console.log(`There are ${numberOfStacks} stacks in puzzle`);

  // Create n stacks
  const stacks = initStacks(
    numberOfStacks,
    initialStacks.slice(0, initialStacks.length - 1)
  );
//   console.log("Stacks init to %o", stacks);

  // get instructions
  const instructions = getInstructions(lines);
    // console.log("These are the instructions to parse: %o", instructions);

    for (const instruction of instructions) {
      const instructionParts = instruction.split(" ");
    //   console.log("Parsing instruction %o", instructionParts);
      const numberToMove = parseInt(instructionParts[1]);
      const fromStack = parseInt(instructionParts[3]);
      const toStack = parseInt(instructionParts[5]);
      console.log(
        "Moving %o from stack %o to stack %o",
        numberToMove,
        fromStack,
        toStack
      );
      for (let i = 0; i < numberToMove; i++) {
        const box = stacks[fromStack - 1].pop();
        if (!box) {
          throw new Error("No box to move");
        }
        stacks[toStack - 1].push(box);
      }
    }

    // console.log(`Final stacks: %o`, stacks);

    const answer = stacks.map((stack) => stack[stack.length - 1]).join("");
    console.log(`The final top box of each stack is ${answer}`);
}

const findNumberOfStacks = (lines: string[]) => {
  // Find number of stacks
  let numberOfStacks = 0;
  for (const line of lines) {
    if (!line.includes("[")) {
      line.split("").forEach((char) => {
        // parseInt(char) will return NaN if char is not a number
        const parsedChar = parseInt(char);
        // console.log("Looking at %o", parsedChar);
        if (!isNaN(parsedChar)) {
          numberOfStacks = parsedChar;
        }
      });
      //   console.log("Returning %o", numberOfStacks);
      return numberOfStacks;
    }
  }
  throw new Error("Unable to determine number of stacks required");
};

const initStacks = (numOfStacks: number, lines: string[]) => {
  let stacks: string[][] = Array.from({ length: numOfStacks }, () => []);

  for (const line of lines) {
    const lineParts = line.split("");
    let currStackIndex = 0;
    for (let i = 0; i < lineParts.length; i += 4) {
      const boxStart = lineParts[i];
      if (boxStart !== " ") {
        const boxChar = lineParts[i + 1];
        // console.log("Found box char %o on stack %o",boxChar,currStackIndex + 1);
        stacks[currStackIndex].push(boxChar);
      }
      currStackIndex++;
    }
  }

  stacks = stacks.map((stack) => stack.reverse());

  // console.log("Are these the initial stacks? %o", stacks);

  return stacks;
};

const getInitialStacks = (lines: string[]) => {
  let currIndex = 0;
  for (const line of lines) {
    if (line === "") {
      return lines.slice(0, currIndex);
    }
    currIndex++;
  }
  throw new Error("Unable to find initial stacks");
};

const getInstructions = (lines: string[]) => {
  let currIndex = 0;
  for (const line of lines) {
    if (line === "") {
      return lines.slice(currIndex + 1);
    }
    currIndex++;
  }
  throw new Error("Unable to find instructions");
};

main()
  .then(() => console.log("Puzzle complete"))
  .catch((err) => console.error(err));
