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

  let overlapCounter = 0;
  for (const line of assignments) {
    // How often is item 3 greater than 0 and less than 2
    // OR
    // How often is item 0 greater than 3 and less than 4

    if (line[2] >= line[0] && line[2] <= line[1]) {
      overlapCounter++;
    } else if (line[0] >= line[2] && line[0] <= line[3]) {
      overlapCounter++;
    }
  }

  console.log(`An assignment overlaps ${overlapCounter} times`);
}

main()
  .then(() => console.log("Finished running puzzle"))
  .catch((err) => console.error(err));
