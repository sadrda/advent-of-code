const isIncreasing = (num) => {
  const splitNum = num.toString().split("");

  let latestMax = -1;
  for (let i = 0; i < splitNum.length; i++) {
    const num = splitNum[i];
    if (num >= latestMax) latestMax = num;
    else return false;
  }

  return true;
};
const hasDoubleDigit = (num) => {
  const splitNum = num.toString().split("");

  for (let i = 0; i < splitNum.length; i++) {
    let num = splitNum[i];
    let nextNum = splitNum[i + 1] ? splitNum[i + 1] : "#";
    let doubleNextNum = splitNum[i + 2] ? splitNum[i + 2] : "#";
    let lastNum = splitNum[i - 1] ? splitNum[i - 1] : "#";
    let doubleLastNum = splitNum[i - 2] ? splitNum[i - 2] : "#";
    if ((num === nextNum || num === lastNum) && nextNum !== lastNum) {
      if (num === nextNum && nextNum !== doubleNextNum) {
        return true;
      }
      if (num === lastNum && lastNum !== doubleLastNum) {
        return true;
      }
    }
  }

  return false;
};

let validNum = 0;
for (let i = 197487; i < 673251; i++) {
  if (isIncreasing(i) && hasDoubleDigit(i)) validNum++;
}
console.log(validNum);
