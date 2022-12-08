import fs from "fs/promises";

async function main() {
  const data = await fs.readFile(`${__dirname}/../inputs.txt`, "utf-8");
  const lines = data.split("\n");
  console.log(lines);

  // Build a 2d array of the trees
  const trees: number[][] = [];
  for (const line of lines) {
    const row: number[] = [];
    for (const char of line) {
      row.push(parseInt(char));
    }
    trees.push(row);
  }
  console.log("Got grid of tree heights: %o", trees);

  // Now we can traverse the grid
  let treeScores: number[] = [];
  for (let row = 0; row < trees.length; row++) {
    for (let col = 0; col < trees[row].length; col++) {
      const currentTreeHeight = trees[row][col];
      const treesLeft = trees[row].slice(0, col);
      const treeRight = trees[row].slice(col + 1);
      const treesAbove = trees.map((row) => row[col]).slice(0, row);
      const treesBelow = trees.map((row) => row[col]).slice(row + 1);

      // Count trees left until we hit a tree equal to or taller than the current tree or the edge of the grid
      let visibleTreesLeft = 0;
      let visibleTreesRight = 0;
      let visibleTreesUp = 0;
      let visibleTreesDown = 0;
      // backwards for loop to look left from marker
      for (let i = treesLeft.length - 1; i >= 0; i--) {
        visibleTreesLeft++;
        if (treesLeft[i] >= currentTreeHeight) break;
      }

      // Check right
      for (let i = 0; i < treeRight.length; i++) {
        visibleTreesRight++;
        if (treeRight[i] >= currentTreeHeight) break;
      }

      // Check up
      for (let i = treesAbove.length - 1; i >= 0; i--) {
        visibleTreesUp++;
        if (treesAbove[i] >= currentTreeHeight) break;
      }

      // Check down
      for (let i = 0; i < treesBelow.length; i++) {
        visibleTreesDown++;
        if (treesBelow[i] >= currentTreeHeight) break;
      }

      const finalTreeScore =
        visibleTreesLeft *
        visibleTreesRight *
        visibleTreesUp *
        visibleTreesDown;

      console.log(`Tree at (${row}, ${col}) has a score of ${finalTreeScore}`);

      treeScores.push(finalTreeScore);
    }
  }

  console.log(`The largest tree score is ${Math.max(...treeScores)}`);
}

main()
  .then(() => console.log("Finished running puzzle"))
  .catch((err) => console.error(err));
