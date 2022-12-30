const fs = require("fs");

console.time();
main();
console.timeEnd();

function main() {
  const input = fs.readFileSync("a12.txt").toString();
  const nodes = getNodes(input);
  logLowestEndDistance(nodes);
}

function logLowestEndDistance(nodes) {
  let minEndDistance = Infinity;
  for (const node of nodes) {
    if (node.height !== "a".charCodeAt(0)) {
      continue;
    }

    for (const node1 of nodes) {
      node1.distance = Infinity;
    }

    const startingNode = node;
    startingNode.distance = 0;
    const nodesToSet = [startingNode];
    setNeighbouringDistances(nodesToSet);

    const endNode = nodes.filter((node) => node.nodeType === "end")[0];

    if (endNode.distance < minEndDistance) {
      minEndDistance = endNode.distance;
    }
  }
  console.log(minEndDistance);
}

function setNeighbouringDistances(nodes) {
  const toSetNext = [];
  for (const node of nodes) {
    for (const neighbour of node.neigbours) {
      if (neighbour.distance !== Infinity) {
        continue;
      }

      neighbour.distance = node.distance + 1;
      toSetNext.push(neighbour);
    }
  }

  if (toSetNext.length > 0) {
    setNeighbouringDistances(toSetNext);
  }
}

function getNodes(input) {
  const rawMap = input.split("\n").map((row) => row.split(""));
  const xSize = rawMap[0].length;

  const nodes = [];

  for (let y = 0; y < rawMap.length; y++) {
    for (let x = 0; x < rawMap[0].length; x++) {
      let char = rawMap[y][x];
      let nodeType = "way";

      if (char === "S") {
        char = "a";
        nodeType = "way";
      }
      if (char === "E") {
        char = "z";
        nodeType = "end";
      }

      const height = char.charCodeAt(0);
      const node = {
        height,
        nodeType,
        distance: Infinity,
        neigbours: [],
      };

      nodes.push(node);
    }
  }

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const neighbourIndices = [i - xSize, i - 1, i + 1, i + xSize];

    for (const neighbourIndex of neighbourIndices) {
      if (neighbourIndex < 0 || neighbourIndex >= nodes.length) {
        continue;
      }

      const neighbourNode = nodes[neighbourIndex];
      if (neighbourNode.height <= node.height + 1) {
        node.neigbours.push(neighbourNode);
      }
    }
  }

  return nodes;
}
