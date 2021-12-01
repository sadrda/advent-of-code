const fs = require("fs");
const input = fs.readFileSync("./a2.txt", "utf8");

let numbers = input.split(",");

numbers[1] = 12;
numbers[2] = 2;

numbers = numbers.map((num) => +num);

for (let noun = 0; noun < 100; noun++) {
  for (let verb = 0; verb < 100; verb++) {
    const copyNumbers = [...numbers];
    copyNumbers[1] = noun;
    copyNumbers[2] = verb;
    let notFound = true;
    let index = 0;

    while (notFound) {
      let command = copyNumbers[index];

      if (command === 1) {
        copyNumbers[copyNumbers[index + 3]] =
          copyNumbers[copyNumbers[index + 1]] +
          copyNumbers[copyNumbers[index + 2]];
      }
      if (command === 2) {
        copyNumbers[copyNumbers[index + 3]] =
          copyNumbers[copyNumbers[index + 1]] *
          copyNumbers[copyNumbers[index + 2]];
      }
      if (command === 99) {
        if (copyNumbers[0] === 19690720) {
          console.log(100 * noun + verb);
        }
        notFound = false;
      }
      index += 4;
    }
  }
}
