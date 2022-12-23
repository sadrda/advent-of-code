const fs = require("fs");

console.time();
main();
console.timeEnd();

function main() {
  const input = fs.readFileSync("a20.txt").toString();
  const linkedList = createLinkedList(input);

  for (let n = 0; n < 10; n++) {
    swapValues(linkedList);
  }

  logSolution(linkedList);
}

function swapValues(linkedList) {
  for (const entry of linkedList) {
    let prev = entry.prev;
    let next = entry.next;

    prev.next = next;
    next.prev = prev;

    let counter = entry.value % (linkedList.length - 1);
    const isPositiveNum = counter > 0;

    while (counter !== 0) {
      if (isPositiveNum) {
        prev = next;
        next = next.next;
      } else {
        next = prev;
        prev = prev.prev;
      }
      counter += isPositiveNum ? -1 : 1;
    }

    prev.next = entry;
    next.prev = entry;
    entry.next = next;
    entry.prev = prev;
  }
}

function logSolution(linkedList) {
  let curr = linkedList.find((node) => node.value === 0);
  const sumVals = [];
  const indicesAfterZeroToBeFound = [1000, 2000, 3000].map(
    (num) => num % linkedList.length
  );

  for (let i = 0; i < linkedList.length; i++) {
    for (const indexToBeFound of indicesAfterZeroToBeFound) {
      if (indexToBeFound === i) {
        sumVals.push(curr.value);
      }
    }
    curr = curr.next;
  }
  console.log(sumVals.reduce((acc, curr) => acc + curr));
}

function createLinkedList(input) {
  const nums = input
    .split("\n")
    .map(Number)
    .map((num) => num * 811589153);

  const linkedList = nums.map((num) => ({
    value: num,
  }));
  const first = linkedList[0];
  const last = linkedList[linkedList.length - 1];

  for (let i = 1; i < linkedList.length - 1; i++) {
    const curr = linkedList[i];

    curr.prev = linkedList[i - 1];
    curr.next = linkedList[i + 1];
  }

  first.prev = last;
  first.next = linkedList[1];
  last.prev = linkedList[linkedList.length - 2];
  last.next = first;

  return linkedList;
}
