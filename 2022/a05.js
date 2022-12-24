const fs = require("fs");

console.time();
main();
console.timeEnd();

function main() {
  const input = fs.readFileSync("a05.txt").toString();

  const stacks = getStacks(input);
  const instructions = getInstructions(input);
  applyInstructionsToStack(stacks, instructions);

  const password = getPasswordFromStack(stacks);
  console.log(password);
}

function getPasswordFromStack(stacks) {
  let password = "";
  for (const stack of stacks) {
    password += stack.pop();
  }
  return password;
}

function applyInstructionsToStack(stacks, instructions) {
  for (const instruction of instructions) {
    const { amount, from, to } = instruction;

    const removed = stacks[from - 1].splice(stacks[from - 1].length - amount);
    stacks[to - 1].push(...removed);
  }
}

function getInstructions(input) {
  const instructionInput = input.split("\n\n")[1];
  const lines = instructionInput.split("\n");

  return lines.map((line) => {
    const [_, amount, from, to] = line.match(/move (.*) from (.*) to (.*)/);
    return {
      amount: Number(amount),
      from: Number(from),
      to: Number(to),
    };
  });
}

function getStacks(input) {
  const stackInput = input.split("\n\n")[0];
  const lines = stackInput.split("\n");

  const stacks = [];
  const stacksCount = (lines[0].length + 1) / 4;
  for (let i = 0; i < stacksCount; i++) {
    stacks.push([]);
  }

  for (let l = 0; l < lines.length - 1; l++) {
    const line = lines[l];
    let n = 0;
    for (let i = 1; i < line.length; i += 4) {
      if (line[i] !== " ") {
        stacks[n].push(line[i]);
      }
      n++;
    }
  }

  for (const stack of stacks) {
    stack.reverse();
  }

  return stacks;
}
