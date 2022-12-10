import fs from "fs/promises";

async function main() {
  const data = await fs.readFile(`${__dirname}/../inputs.txt`, "utf-8");
  const lines = data
    .split("\n")
    .map((line) => line.split(" "))
    .map(([instruction, number]) => [
      instruction,
      number ? parseInt(number) : undefined,
    ]) as [string, number | undefined][];

  // Map cycle number to signal strength
  const signalStrengthMap: Record<number, number> = {};
  const importantCycles = [20, 60, 100, 140, 180, 220];

  let cycleCount = 1;
  let xValue = 1;
  for (const [instruction, number] of lines) {
    // Capture signal strength if it's an important cycle or if it's the cycle after an addx
    if (importantCycles.includes(cycleCount)) {
      signalStrengthMap[cycleCount] = xValue;
    } else if (
      importantCycles.includes(cycleCount + 1) &&
      instruction === "addx"
    ) {
      signalStrengthMap[cycleCount + 1] = xValue;
    }

    // Increment cycles and x value
    if (instruction === "noop") {
      cycleCount++;
    } else if (instruction === "addx" && number) {
      xValue += number;
      cycleCount += 2;
    }
  }

  const signalStrengthSum = Object.entries(signalStrengthMap).reduce(
    (acc, [cycle, signal]) => {
      const signalStrength = parseInt(cycle) * signal;
      return acc + signalStrength;
    },
    0
  );

  console.log(`The signal strength sum is ${signalStrengthSum}`);
}

main()
  .then(() => console.log("Finished running puzzle"))
  .catch((err) => console.error(err));
