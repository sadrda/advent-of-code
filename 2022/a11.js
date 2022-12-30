const fs = require("fs");

const ROUNDS = 10000;

console.time();
main();
console.timeEnd();

function main() {
  const input = fs.readFileSync("a11.txt").toString();
  const monkeys = getMonkeys(input);
  tantrum(monkeys);
  const tantrumProduct = getTantrumProduct(monkeys);
  console.log(tantrumProduct);
}

function getTantrumProduct(monkeys) {
  monkeys.sort((m1, m2) => m2.inspectionCount - m1.inspectionCount);
  return monkeys[0].inspectionCount * monkeys[1].inspectionCount;
}

function applyRound(monkeys) {
  for (const monkey of monkeys) {
    const { items, modulo, trueThrow, falseThrow } = monkey;

    while (items.length !== 0) {
      let item = items.shift();
      monkey.inspectionCount++;
      applyFunctionToItem(item, monkey.function);

      if (item[Number(modulo)] === 0) {
        monkeys[trueThrow].items.push(item);
      } else {
        monkeys[falseThrow].items.push(item);
      }
    }
  }
}

function applyFunctionToItem(item, func) {
  const { v1, operator, v2 } = func;

  for (const [key, value] of Object.entries(item)) {
    let left = v1 === "old" ? value : Number(v1);
    let right = v2 === "old" ? value : Number(v2);

    let res = null;
    if (operator === "+") res = left + right;
    if (operator === "*") res = left * right;

    item[key] = res % key;
  }
}

function tantrum(monkeys) {
  for (let i = 0; i < ROUNDS; i++) {
    applyRound(monkeys);
  }
}

function getMonkeys(input) {
  const monkeys = input.split("\n\n").map((rawMonkey) => {
    const monkey = { inspectionCount: 0 };

    const lines = rawMonkey.split("\n");
    for (const line of lines) {
      const trimLine = line.trim();

      if (trimLine.startsWith("Starting")) {
        const [_, items] = trimLine.match(/Starting items: (.*)/);
        monkey.items = items.split(", ").map(Number);
      }

      if (trimLine.startsWith("Operation")) {
        const [_, func] = trimLine.match(/Operation: new = (.*)/);
        const [v1, operator, v2] = func.split(" ");
        monkey.function = {
          v1,
          operator,
          v2,
        };
      }

      if (trimLine.startsWith("Test")) {
        const [_, modulo] = trimLine.match(/Test: divisible by (.*)/);
        monkey.modulo = Number(modulo);
      }

      if (trimLine.startsWith("If true")) {
        const [_, trueThrow] = trimLine.match(/If true: throw to monkey (.*)/);
        monkey.trueThrow = Number(trueThrow);
      }

      if (trimLine.startsWith("If false")) {
        const [_, falseThrow] = trimLine.match(
          /If false: throw to monkey (.*)/
        );
        monkey.falseThrow = Number(falseThrow);
      }
    }

    return monkey;
  });

  const modulos = monkeys.map((monkey) => monkey.modulo);

  for (const monkey of monkeys) {
    monkey.items = monkey.items.map((item) => {
      const newItem = {};

      for (const modulo of modulos) {
        newItem[modulo] = item % modulo;
      }

      return newItem;
    });
  }

  return monkeys;
}
