const fs = require("fs");

const WORD_LENGTH = 14;

console.time();
main();
console.timeEnd();

function main() {
  const input = fs.readFileSync("a06.txt").toString();
  const startOfPacket = findStartOfPacket(input);

  console.log(startOfPacket);
}

function findStartOfPacket(input) {
  for (let i = 0; i < input.length - WORD_LENGTH; i++) {
    const word = input.substring(i, i + WORD_LENGTH);

    let duplicateChar = false;
    for (let a = 0; a < word.length; a++) {
      for (let b = a + 1; b < word.length; b++) {
        if (word[a] === word[b]) {
          duplicateChar = true;
        }
      }
    }

    if (!duplicateChar) {
      return i + WORD_LENGTH;
    }
  }
}
