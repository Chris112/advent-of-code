import fs from "fs/promises";
import { sumNumberArray } from "../../helpers";

const exampleInputs = [
  [1000, 2000, 3000],
  [4000],
  [5000, 6000],
  [7000, 8000, 9000],
  [10000],
];

const main = async () => {
  // Load inputs and build 2d number array
  const rawInput = await fs.readFile(`${__dirname}/inputs.txt`, "utf-8");
  //   console.log(rawInput);

  const parsedInput = rawInput.split("\r\n");

  let elfIndex = 0;
  const inputs = parsedInput.reduce((acc, num) => {
    // Create arr if first number for current elf
    if (acc[elfIndex] === undefined) {
      acc[elfIndex] = [];
    }

    // If num is blank, indicates elf is done
    if (num === "") {
      elfIndex++;
      return acc;
    }

    acc[elfIndex].push(parseInt(num));

    return acc;
  }, [] as number[][]);

  const originalInputs = [...inputs];
  console.log("Length of inputs: %o", originalInputs.length);

  // Determine first elf index
  const firstElf = findLargestIndex(inputs);
  if (!firstElf) throw new Error("No inputs!");

  // Remove the first elf
  inputs.splice(firstElf, 1);
  const inputs2 = [...inputs];
  const secondElf = findLargestIndex(inputs);
  if (!secondElf) throw new Error("No inputs!");

  // Remove the second elf
  inputs.splice(secondElf, 1)
  const inputs3 = [...inputs];
  const thirdElf = findLargestIndex(inputs);
  if (!thirdElf) throw new Error("No inputs!");

  const firstElfCalorieCount = sumNumberArray(originalInputs[firstElf]);
  const secondElfCalorieCount = sumNumberArray(inputs2[secondElf]);
  const thirdElfCalorieCount = sumNumberArray(inputs3[thirdElf]);
  const calorieSum =
    firstElfCalorieCount + secondElfCalorieCount + thirdElfCalorieCount;

  console.log(
    `The elf with the most is ${
      firstElf + 1
    } with ${firstElfCalorieCount} calories`
  );
  console.log(
    `The elf with the second most is ${
      secondElf + 1
    } with ${secondElfCalorieCount} calories`
  );
  console.log(
    `The elf with the third most is ${
      thirdElf + 1
    } with ${thirdElfCalorieCount} calories`
  );

  console.log("The total number of calories held by all 3 is %d", calorieSum);
};

// Find the largest index within a 2d array of numbers
const findLargestIndex = (inputs: number[][]): number | null => {
  // let largestValue: number | null = null;
  let largestValueIndex: number | null = null;

  inputs.forEach((input, index) => {
    // If no existing value, take the first
    if (!largestValueIndex) {
      largestValueIndex = index;
      return;
    }

    // Sum the current values
    const currentTotal = sumNumberArray(inputs[largestValueIndex]);
    const total = sumNumberArray(input);

    // If new largest, set the tracked index to the current iterations index
    if (total > currentTotal) {
      largestValueIndex = index;
    }
  });

  return largestValueIndex;
};

main()
  .then(() => console.log("Run complete"))
  .catch((err) => console.error(err));
