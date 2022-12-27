const fs = require("fs");

const BASE = 5;

console.time();
main();
console.timeEnd();

function main() {
  const input = fs.readFileSync("a25.txt").toString();
  const decimals = input.split("\n").map(snafuToDecimal);
  const decimalSum = decimals.reduce((acc, curr) => acc + curr);
  const snafu = decimalToSnafu(decimalSum);
  console.log(snafu);
}

function snafuToDecimal(num) {
  const snafuArr = num.split("");
  const decimalArr = snafuArr.map(snafuDigitToDecimal);

  let sum = 0;

  for (let i = 0; i < decimalArr.length; i++) {
    const digit = decimalArr[i];
    const expoValue = decimalArr.length - 1 - i;

    sum += digit * Math.pow(BASE, expoValue);
  }

  return sum;
}

function snafuDigitToDecimal(snafuDigit) {
  if (snafuDigit === "-") {
    return -1;
  }
  if (snafuDigit === "=") {
    return -2;
  }
  return Number(snafuDigit);
}

function decimalDigitToSnafu(decimal) {
  if (decimal === -1) {
    return "-";
  }
  if (decimal === -2) {
    return "=";
  }
  return Number(decimal);
}

function decimalToSnafu(num) {
  let digits = 1;
  let absSum = 0;

  while (true) {
    const digSum = 2 * Math.pow(5, digits - 1);
    absSum += digSum;

    if (num <= absSum) {
      break;
    }
    digits++;
  }

  let restNum = num;
  const snafuDigits = [];
  for (let i = digits - 1; i >= 0; i--) {
    const maxDigitDistance = Math.pow(5, i) / 2;
    for (let decimalDigit = -2; decimalDigit < 3; decimalDigit++) {
      const digitValue = decimalDigit * Math.pow(5, i);
      //console.log({ i, decimalDigit, restNum });

      if (restNum - digitValue < maxDigitDistance) {
        const snafuDigit = decimalDigitToSnafu(decimalDigit);
        snafuDigits.push(snafuDigit);
        restNum -= digitValue;
        break;
      }
    }
  }

  return snafuDigits.join("");
}
