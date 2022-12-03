import fs from "fs/promises";
import { sumNumberArray } from "../../../helpers";

// first column is what they're playing
// A = rock
// B = paper
// C = scissors

// what you should play
// x for rock
// y for paper
// z for scissors

// scoring
// 1 for rock
// 2 for paper
// 3 for scissors

// 0 if you lost,
// 3 for draw
// 6 for win

enum ElfPlay {
  "Rock" = "A",
  "Paper" = "B",
  "Scissors" = "C",
}

enum HumanPlay {
  "Rock" = "X",
  "Paper" = "Y",
  "Scissors" = "Z",
}

enum DesiredResult {
  "Lose" = "X",
  "Draw" = "Y",
  "Win" = "Z",
}

const playMap: Record<ElfPlay, Record<DesiredResult, HumanPlay>> = {
  [ElfPlay.Rock]: {
    [DesiredResult.Lose]: HumanPlay.Scissors,
    [DesiredResult.Draw]: HumanPlay.Rock,
    [DesiredResult.Win]: HumanPlay.Paper,
  },
  [ElfPlay.Paper]: {
    [DesiredResult.Lose]: HumanPlay.Rock,
    [DesiredResult.Draw]: HumanPlay.Paper,
    [DesiredResult.Win]: HumanPlay.Scissors,
  },
  [ElfPlay.Scissors]: {
    [DesiredResult.Lose]: HumanPlay.Paper,
    [DesiredResult.Draw]: HumanPlay.Scissors,
    [DesiredResult.Win]: HumanPlay.Rock,
  },
};

const outcomeScoreMap: Record<ElfPlay, Record<HumanPlay, number>> = {
  [ElfPlay.Rock]: {
    [HumanPlay.Scissors]: 0,
    [HumanPlay.Rock]: 3,
    [HumanPlay.Paper]: 6,
  },
  [ElfPlay.Paper]: {
    [HumanPlay.Rock]: 0,
    [HumanPlay.Paper]: 3,
    [HumanPlay.Scissors]: 6,
  },
  [ElfPlay.Scissors]: {
    [HumanPlay.Paper]: 0,
    [HumanPlay.Scissors]: 3,
    [HumanPlay.Rock]: 6,
  },
};

const shapeScoreMap: Record<HumanPlay, number> = {
  [HumanPlay.Rock]: 1,
  [HumanPlay.Paper]: 2,
  [HumanPlay.Scissors]: 3,
};

async function main() {
  // Read in inputs file
  const rawInputs = await fs.readFile(`${__dirname}/../inputs.txt`, "utf-8");

  // Split each line into an array
  const games = rawInputs.split("\n").map((line) => line.split(" ")) as [
    ElfPlay,
    HumanPlay
  ][];

  // Loop through each line
  let scores: number[] = [];
  for (const [elfPlay, desiredResult] of games) {
    const humanPlay = playMap[elfPlay][desiredResult];
    const outcomeScore = outcomeScoreMap[elfPlay][humanPlay];
    const shapeScore = shapeScoreMap[humanPlay];

    scores.push(outcomeScore + shapeScore);
  }

  const totalScore = sumNumberArray(scores);

  console.log(`Total score is ${totalScore} points`);
}

main()
  .then(() => console.log("Finished running puzzle"))
  .catch((err) => console.error(err));
