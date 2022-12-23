const fs = require("fs");

console.time();
main();
console.timeEnd();

function main() {
  const input = fs.readFileSync("a21.txt").toString();
  const monkeys = getMonkeys(input);
  const root = monkeys.root;
  delete monkeys[root];

  let n = 0;
  while (true) {
    const monkeyCopies = structuredClone(monkeys);
    monkeyCopies.humn.isSolved = true;
    monkeyCopies.humn.value = n;
    console.log("-----");
    const difference = checkDifference(monkeyCopies, root);
    console.log({ n, difference });
    console.log("-----");

    if (difference === 0) {
      console.log({ n });
      break;
    } else {
      let divisor = 93;
      if (Math.abs(difference) < 500) {
        divisor = difference;
      }
      const diffAdd = Math.round(difference / divisor);
      console.log({ diffAdd });
      n += diffAdd > 0 ? diffAdd : -diffAdd;
    }
  }
}

function checkDifference(monkeys, root) {
  solveMonkeys(monkeys);
  const [left, _, right] = root.value;
  console.log({ left: monkeys[left].value, right: monkeys[right].value });

  return monkeys[right].value - monkeys[left].value;
}

function solveMonkeys(monkeys) {
  let allSolved = false;

  while (!allSolved) {
    for (const data of Object.values(monkeys)) {
      const { isSolved, value } = data;
      if (isSolved) {
        continue;
      }
      const [left, operator, right] = value;
      if (monkeys[left].isSolved && monkeys[right].isSolved) {
        data.value = getValueFromOperation(
          monkeys[left].value,
          operator,
          monkeys[right].value
        );

        data.isSolved = true;
      }
    }

    allSolved = Object.values(monkeys).every((monkey) => monkey.isSolved);
  }
}

function getValueFromOperation(v1, op, v2) {
  if (op === "+") return v1 + v2;
  if (op === "-") return v1 - v2;
  if (op === "*") return v1 * v2;
  if (op === "/") return v1 / v2;
  console.error("OPERAND NOT FOUND");
}

function getMonkeys(input) {
  const monkeys = {};
  const lines = input.split("\n");
  for (const line of lines) {
    const splitLine = line.split(": ");
    const name = splitLine[0];
    const isSolved = !isNaN(splitLine[1]);
    const value = isSolved ? Number(splitLine[1]) : splitLine[1].split(" ");
    monkeys[name] = { isSolved, value };
  }

  return monkeys;
}
