const fs = require("fs")

const input = fs.readFileSync("./a13.txt", "utf8")

const raw = input.split("\n")

const arrival = +raw[0]
const buses = raw[1]
  .split(",")
  .filter((bus) => bus !== "x")
  .map((bus) => +bus)

const differences = buses.map((bus) => {
  let counter = 0
  while (counter < arrival) {
    counter += bus
  }
  return { wait: counter - arrival, id: bus }
})
let minWaitingBus = null

differences.forEach((bus) => {
  if (!minWaitingBus || bus.wait < minWaitingBus.wait)
    minWaitingBus = bus
})
console.log(minWaitingBus.wait * minWaitingBus.id)

/*
part2
entered input manually into wolfram alpha
t%23=0 AND (t+13)%41=0 AND (t+23)%829=0 AND (t+36)%13=0 AND (t+37)%17=0 AND (t+52)%29=0 AND (t+54)%677=0 AND (t+60)%37=0 AND (t+73)%19=0
*/
