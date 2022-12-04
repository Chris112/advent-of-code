import fs from "fs/promises";

async function main() {
  const data = await fs.readFile(`${__dirname}/../inputs.txt`, "utf-8");
  const lines = data.split("\n").map((line) => line.split(","));
  const assignmentsNested = lines.map((line) =>
    line.map((assignment) =>
      assignment.split("-").map((assignment) => parseInt(assignment))
    )
  );
  const assignments = assignmentsNested.map((line) => line.flat());
  console.log(assignments);

  let fullyContainsCounter = 0;
  for (const line of assignments) {
    console.log("Looking at line %o", line.join(","));
    // Check if the first assignment fully contains the second

    // if 3 >= 0 AND 4 <= 1
    if (line[2] >= line[0] && line[3] <= line[1]) {
      // second fully contained in the first
      fullyContainsCounter++;
      continue;
    }

    // Check if the second assignment fully contains the first
    // if 0 >= 3 AND 2 <= 4
    if (line[0] >= line[2] && line[1] <= line[3]) {
      // first fully contained in the first
      fullyContainsCounter++;
      continue;
    }
  }

  console.log(
    `An assignment is fully contained in the other ${fullyContainsCounter} times`
  );
}

main()
  .then(() => console.log("Finished running puzzle"))
  .catch((err) => console.error(err));
