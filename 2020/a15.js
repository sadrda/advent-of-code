const numTable = {
  lastIndex: 5,
  last: 2,
  7: 0,
  12: 1,
  1: 2,
  0: 3,
  16: 4,
}
const getNextNum = (numTable) => {
  let newNum = 0
  if (numTable[numTable.last] !== undefined) {
    newNum = numTable.lastIndex - numTable[numTable.last]
  }
  numTable[numTable.last] = numTable.lastIndex
  numTable.lastIndex++
  numTable.last = newNum
}

while (numTable.lastIndex < 29999999) {
  getNextNum(numTable)
}
console.log(numTable.last)
