import fs from "fs/promises";

const CRT_WIDTH = 40;
const CRT_HEIGHT = 6;

async function main() {
  const data = await fs.readFile(`${__dirname}/../inputs.txt`, "utf-8");
  const lines = data
    .split("\n")
    .map((line) => line.split(" "))
    .map(([instruction, number]) => [
      instruction,
      number ? parseInt(number) : undefined,
    ]) as [string, number | undefined][];

  // Init screen with blank pixels 40x6
  let crtScreen: string[] = Array.from(
    { length: CRT_WIDTH * CRT_HEIGHT },
    () => ""
  );

  let cycle = 1;
  let spritePosition = 1;
  for (const [instruction, number] of lines) {
    if (instruction === "noop") {
      crtScreen = draw(cycle, crtScreen, spritePosition, instruction);
      cycle++;
    } else if (instruction === "addx" && number) {
      // execute 2 cycles for an addx instruction
      for (let i = 0; i < 2; i++) {
        crtScreen = draw(cycle, crtScreen, spritePosition, instruction, number);

        // Increment sprite position and cycle
        if (i === 2) spritePosition += number;
        cycle++;
      }
    }
  }

  // print screen to console in 40x6 grid
  for (let i = 0; i < CRT_HEIGHT; i++) {
    const row = crtScreen.slice(i * CRT_WIDTH, i * CRT_WIDTH + CRT_WIDTH);
    console.log(row.join(""));
  }
}

const getPixelToDraw = (spritePosition: number, pixel: number) => {
  if (spritePosition - 1 === pixel) {
    return "#";
  } else if (spritePosition === pixel) {
    return "#";
  } else if (spritePosition + 1 === pixel) {
    return "#";
  } else {
    return ".";
  }
};

const draw = (
  cycle: number,
  crtScreen: string[],
  spritePosition: number,
  instruction: string,
  addCount?: number
) => {
  const pixel = cycle - 1;
  const pixelIndexInRow = pixel % CRT_WIDTH;
  const screenRow = Math.floor(pixel / CRT_WIDTH);

  // Draw to screen
  const pixelToDraw = getPixelToDraw(spritePosition, pixelIndexInRow);

  crtScreen[pixel] = pixelToDraw;
  const screenRowPixels = crtScreen.slice(
    screenRow * CRT_WIDTH,
    screenRow * CRT_WIDTH + CRT_WIDTH
  );

  // prettier-ignore
  console.log(`Start cycle  ${cycle}: begin executing ${instruction} ${addCount ?? ""}`);
  console.log(`During cy1cle ${cycle}: CRT draws pixel in position ${pixel}`);
  console.log(`Currenct CRT row: ${screenRowPixels.join("")}`);
  console.log("");
  return crtScreen;
};

main()
  .then(() => console.log("Finished running puzzle"))
  .catch((err) => console.error(err));
