import fs from "fs/promises";

async function main() {
  const data = await fs.readFile(`${__dirname}/../inputs.txt`, "utf-8");
  const lines = data.split("\n");

  // Build a 2d array of the trees
  const trees: number[][] = [];
  for (const line of lines) {
    const row: number[] = [];
    for (const char of line) {
      row.push(parseInt(char));
    }
    trees.push(row);
  }

  // Now we can traverse the grid
  let numTreesVisible = 0;
  for (let row = 0; row < trees.length; row++) {
    for (let col = 0; col < trees[row].length; col++) {
      // If we're on the edge of the grid, the tree is always visible
      if (
        col === 0 ||
        row === 0 ||
        col === trees[row].length - 1 ||
        row === trees.length - 1
      ) {
        numTreesVisible++;
        continue;
      }

      const currentTreeHeight = trees[row][col];

      // Check left
      const leftRow = trees[row].slice(0, col);
      const isVisibleFromLeft = leftRow.every(
        (currHeight) => currentTreeHeight > currHeight
      );

      // Check right
      const rightRow = trees[row].slice(col + 1);
      const isVisibleFromRight = rightRow.every(
        (currHeight) => currentTreeHeight > currHeight
      );

      // Check up
      const treesAbove = trees.map((row) => row[col]).slice(0, row);
      const isVisibleFromTop = treesAbove.every(
        (currHeight) => currentTreeHeight > currHeight
      );

      // Check below
      const treesBelow = trees.map((row) => row[col]).slice(row + 1);
      const isVisibleFromBottom = treesBelow.every(
        (currHeight) => currentTreeHeight > currHeight
      );

      //   if (isVisibleFromLeft) {
      //     console.log(`Curr tree at ${row}, ${col} is visible from the left`);
      //   }
      //   if (isVisibleFromRight) {
      //     console.log(`Curr tree at ${row}, ${col} is visible from the right`);
      //   }
      //   if (isVisibleFromTop) {
      //     console.log(`Curr tree at ${row}, ${col} is visible from the top`);
      //   }
      //   if (isVisibleFromBottom) {
      //     console.log(`Curr tree at ${row}, ${col} is visible from the bottom`);
      //   }

      if (
        isVisibleFromLeft ||
        isVisibleFromRight ||
        isVisibleFromTop ||
        isVisibleFromBottom
      ) {
        numTreesVisible++;
      }
    }
  }

  console.log(`There are ${numTreesVisible} trees visible`);
}

main()
  .then(() => console.log("Finished running puzzle"))
  .catch((err) => console.error(err));
