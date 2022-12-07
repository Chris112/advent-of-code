import fs from "fs/promises";

const AVAILABLE_SPACE = 70000000;
const MIN_TARGET_SPACE = 30000000;

async function main() {
  const data = await fs.readFile(`${__dirname}/../inputs.txt`, "utf-8");
  const lines = data.split("\r\n");

  // Pull files and folders from input
  const files: { path: string; size: number }[] = [{ path: "/", size: 0 }];

  // Current state of file path
  const currentPath: string[] = ["/"];

  // Parse instructions and get all files/dirs + their sizes
  for (const line of lines) {
    if (line.startsWith("$ ")) {
      // command executed
      const [_, command, newDir] = line.split(" ");
      //   const command = lineSplit[1];
      if (command === "cd") {
        // change dir
        if (newDir === "..") {
          currentPath.pop();
        } else if (newDir === "/") {
          // Set current path to root
          for (const p of currentPath) {
            if (p !== "/") currentPath.pop();
          }
        } else {
          // Changing into new dir
          currentPath.push(newDir);
        }
      } else if (command === "ls") {
        // listing files
        // not changing path so do nothing
      }
    } else if (line.startsWith("dir ")) {
      // Parsing a dir
      const newDirName = line.split(" ")[1];
      const newPath = currentPath.join("/").substring(1);
      const newDir = `${newPath}/${newDirName}`;
      files.push({ path: newDir, size: 0 });
    } else {
      // Parsing a file
      const [size, filename] = line.split(" ");
      const newPath = currentPath.join("/").substring(1);
      const newFilename = `${newPath}/${filename}`;
      files.push({ path: newFilename, size: parseInt(size) });
    }
  }

  //   console.log("All files and dirs in elfs device: %o", files);

  const dirMap: Record<string, number> = {};
  for (const file of files) {
    if (file.size === 0) {
      // File is a dir, add it to map and init to 0
      dirMap[file.path] = 0;
    } else {
      // File is a file, add file size to running sum

      // Build a base file path
      const basePath = file.path.substring(1).split("/");
      basePath.pop();
      const path = `/${basePath.join("/")}`;

      // Sum file at the current base path
      dirMap[path] += file.size;
    }
  }

  //   console.log("All directories and their sizes  %o", dirMap);

  // Calculate nested sizes
  for (const [path1, dirSum1] of Object.entries(dirMap)) {
    for (const [path2, dirSum2] of Object.entries(dirMap)) {
      if (path1 === path2) continue;
      if (path2.includes(path1)) {
        dirMap[path1] += dirSum2;
      }
    }
  }

  //   console.log("Summed nested dirs: %o", dirMap);

  let usedSpace = dirMap["/"];

  const requiredSpaceToFree = AVAILABLE_SPACE - usedSpace;

  console.log(
    "Used %o of %o and need to free up %o",
    usedSpace,
    AVAILABLE_SPACE,
    requiredSpaceToFree
  );

  delete dirMap["/"];
  let minRequiredSpaceToFree = 0;
  for (const size of Object.values(dirMap)) {
    // If size of dir + free space is greater than MIN_TARGET_SPACE
    if (
      size + requiredSpaceToFree > MIN_TARGET_SPACE &&
      (minRequiredSpaceToFree === 0 || size < minRequiredSpaceToFree)
    ) {
      console.log("New optiimal size is %o", size);
      minRequiredSpaceToFree = size;
    }
  }

  console.log("Final size to free is %o", minRequiredSpaceToFree);
}

main()
  .then(() => console.log("Finished running puzzle"))
  .catch((err) => console.error(err));
