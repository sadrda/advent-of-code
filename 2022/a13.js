const fs = require("fs");

console.time();
main();
console.timeEnd();

function main() {
  const input = fs.readFileSync("a13.txt").toString();
  const packets = getPackets(input);
  const indexProduct = getIndexProduct(packets);

  console.log(indexProduct);
}

function checkValidity(packet) {
  const { left, right } = packet;
  const leftIsArray = Array.isArray(left);
  const rightIsArray = Array.isArray(right);

  if (!leftIsArray && !rightIsArray) {
    if (left > right) {
      return false;
    }
    if (left < right) {
      return true;
    }
  }

  if (!leftIsArray && rightIsArray) {
    return checkValidity({ left: [left], right });
  }

  if (leftIsArray && !rightIsArray) {
    return checkValidity({ left, right: [right] });
  }

  if (leftIsArray && rightIsArray) {
    for (let i = 0; i < left.length; i++) {
      if (i >= right.length) {
        return false;
      }

      const isValid = checkValidity({ left: left[i], right: right[i] });
      if (isValid === undefined) {
        continue;
      }

      return isValid;
    }

    if (left.length < right.length) {
      return true;
    }
  }

  return undefined;
}

function getIndexProduct(packets) {
  packets.sort((s1, s2) => (checkValidity({ left: s2, right: s1 }) ? 1 : -1));

  let i1 = null;
  let i2 = null;

  for (let i = 0; i < packets.length; i++) {
    const packet = packets[i];
    if (JSON.stringify(packet) === "[[2]]") i1 = i + 1;
    if (JSON.stringify(packet) === "[[6]]") i2 = i + 1;
  }

  return i1 * i2;
}

function getPackets(input) {
  const rawPackets = input.split("\n\n").join("\n");
  const packets = rawPackets.split("\n").map((line) => JSON.parse(line));

  packets.push([[2]]);
  packets.push([[6]]);

  return packets;
}
