const fs = require("fs");

const input = fs.readFileSync("a04.txt").toString();
const compartments = input.split("\n").map((compartment) => {
  return compartment.split(",").map((elf) => elf.split("-").map(Number));
});

const overlaps = compartments.map((c) => {
  const c1 = c[0];
  const c2 = c[1];

  return compartmentsAreOverlapping(c1, c2);
});

console.log(overlaps.filter(Boolean).length);

function compartmentsAreOverlapping(c1, c2) {
  return (
    (c1[0] <= c2[1] && c1[1] >= c2[0]) || (c2[0] <= c1[1] && c2[1] >= c1[0])
  );
}
