import fs from "fs/promises";

const DIR_SIZE_MIN = 100000;

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

  // console.log("Summed nested dirs: %o", dirMap);

  let sum = 0;
  for (const dirSum of Object.values(dirMap)) {
    if (dirSum <= DIR_SIZE_MIN) {
      sum += dirSum;
    }
  }

  console.log("The final sum is %o", sum);
}

main()
  .then(() => console.log("Finished running puzzle"))
  .catch((err) => console.error(err));
