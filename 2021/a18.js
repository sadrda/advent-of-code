const fs = require("fs");

const increaseLeftMostNum = (tree, num) => {
  if (!Array.isArray(tree[0])) {
    tree[0] += num;
    return true;
  }
  if (increaseLeftMostNum(tree[0], num)) {
    return true;
  }
  if (!Array.isArray(tree[1])) {
    tree[1] += num;
    return true;
  }
  if (increaseLeftMostNum(tree[1], num)) {
    return true;
  }
  return false;
};

const increaseRightMostNum = (tree, num) => {
  if (!Array.isArray(tree[1])) {
    tree[1] += num;
    return true;
  }
  if (increaseRightMostNum(tree[1], num)) {
    return true;
  }
  if (!Array.isArray(tree[0])) {
    tree[0] += num;
    return true;
  }
  if (increaseRightMostNum(tree[0], num)) {
    return true;
  }
  return false;
};

const fillDepthTree = (currentExpression, expressionToSearch, tree) => {
  const [leftExpression, rightExpression] = currentExpression;
  if (currentExpression === expressionToSearch) {
    tree.push(currentExpression);
    return true;
  }

  if (Array.isArray(leftExpression)) {
    const leftExpressionContainsExpressionToSearch = fillDepthTree(
      leftExpression,
      expressionToSearch,
      tree
    );
    if (leftExpressionContainsExpressionToSearch) {
      tree.push(currentExpression);
      return true;
    }
  }
  if (Array.isArray(rightExpression)) {
    const rightExpressionContainsExpressionToSearch = fillDepthTree(
      rightExpression,
      expressionToSearch,
      tree
    );
    if (rightExpressionContainsExpressionToSearch) {
      tree.push(currentExpression);
      return true;
    }
  }

  return false;
};

const explode = (wholeExpression, currentExpression) => {
  const [leftNum, rightNum] = currentExpression;
  const depthTree = [];
  fillDepthTree(wholeExpression, currentExpression, depthTree);

  let leftNumHasBeenAdded = false;
  let rightNumHasBeenAdded = false;
  for (let i = 0; i < depthTree.length - 1; i++) {
    const prevExpression = depthTree[i];
    const nextExpression = depthTree[i + 1];
    let [nextExpressionLeft, nextExpressionRight] = nextExpression;
    if (nextExpressionLeft === prevExpression && !rightNumHasBeenAdded) {
      if (!Array.isArray(nextExpressionRight)) {
        nextExpression[1] += rightNum;
        rightNumHasBeenAdded = true;
      } else if (increaseLeftMostNum(nextExpressionRight, rightNum)) {
        rightNumHasBeenAdded = true;
      }
    }
    if (nextExpressionRight === prevExpression && !leftNumHasBeenAdded) {
      if (!Array.isArray(nextExpressionLeft)) {
        nextExpression[0] += leftNum;
        leftNumHasBeenAdded = true;
      } else if (increaseRightMostNum(nextExpressionLeft, leftNum)) {
        leftNumHasBeenAdded = true;
      }
    }
  }

  // set leftmost in right tree to rightNum
  if (
    !rightNumHasBeenAdded &&
    depthTree[depthTree.length - 2] === depthTree[depthTree.length - 1][0]
  ) {
    const toSearch = depthTree[depthTree.length - 1][1];
    increaseLeftMostNum(toSearch, rightNum);
  }
  // set rightmost in left tree to leftNum
  if (
    !leftNumHasBeenAdded &&
    depthTree[depthTree.length - 2] === depthTree[depthTree.length - 1][1]
  ) {
    const toSearch = depthTree[depthTree.length - 1][0];
    increaseRightMostNum(toSearch, leftNum);
  }
};

const solveForExplosion = (wholeExpression, currentExpression, depth) => {
  let [leftPair, rightPair] = currentExpression;

  const leftPairIsArray = Array.isArray(leftPair);
  const rightPairIsArray = Array.isArray(rightPair);

  if (leftPairIsArray) {
    const exploded = solveForExplosion(wholeExpression, leftPair, depth + 1);
    if (exploded) {
      currentExpression[0] = 0;
    }
  }
  if (rightPairIsArray) {
    const exploded = solveForExplosion(wholeExpression, rightPair, depth + 1);
    if (exploded) {
      currentExpression[1] = 0;
    }
  }

  if (!leftPairIsArray && !rightPairIsArray && depth > 4) {
    explode(wholeExpression, currentExpression);
    return true;
  }
  return false;
};

const splitOnce = (currentExpression) => {
  let [leftPair, rightPair] = currentExpression;

  if (Array.isArray(leftPair)) {
    if (splitOnce(leftPair)) return true;
  } else if (leftPair >= 10) {
    currentExpression[0] = [Math.floor(leftPair / 2), Math.ceil(leftPair / 2)];
    return true;
  }
  if (Array.isArray(rightPair)) {
    if (splitOnce(rightPair)) return true;
  } else if (rightPair >= 10) {
    currentExpression[1] = [
      Math.floor(rightPair / 2),
      Math.ceil(rightPair / 2),
    ];
    return true;
  }
  return false;
};

const solve = (expression) => {
  while (true) {
    solveForExplosion(expression, expression, 1);
    const splitted = splitOnce(expression);
    if (!splitted) break;
  }
  return expression;
};

const getMagnitude = (expression) => {
  if (!Array.isArray(expression)) return expression;
  return 3 * getMagnitude(expression[0]) + 2 * getMagnitude(expression[1]);
};

const input = fs.readFileSync("a18.txt").toString();
const expressions = input.split("\n").map((line) => JSON.parse(line));

const solved = expressions.map((expression) => solve(expression));

let maxMagnitude = -Infinity;
for (let i = 0; i < solved.length; i++) {
  for (let j = 0; j < solved.length; j++) {
    const solvedI = JSON.parse(JSON.stringify(solved[i]));
    const solvedJ = JSON.parse(JSON.stringify(solved[j]));

    if (JSON.stringify(solvedI) === JSON.stringify(solvedJ)) continue;
    let magnitude = getMagnitude(solve([solvedI, solvedJ]));
    if (magnitude > maxMagnitude) {
      maxMagnitude = magnitude;
    }
    console.log(magnitude);
  }
}
console.log(maxMagnitude);
