const fs = require("fs");

console.time();
main();
console.timeEnd();

function main() {
  const input = fs.readFileSync("a07.txt").toString();
  const rootNode = getRootNode(input);
  addSubDirectorySizes(rootNode);
  const sizes = [];
  fillSizes(rootNode, sizes);
  const sortedSizes = sizes
    .filter((size) => size !== undefined)
    .sort((s1, s2) => s1 - s2);

  const freeSpace = 70000000 - rootNode.size;
  const neededSpace = 30000000 - freeSpace;
  for (let i = 1; i < sortedSizes.length; i++) {
    if (sortedSizes[i - 1] < neededSpace && sortedSizes[i] > neededSpace) {
      console.log(sortedSizes[i]);
      break;
    }
  }
}

function fillSizes(node, sizes) {
  sizes.push(node.size);
  sizes.push(...node.children.map((child) => fillSizes(child, sizes)));
}

function addSubDirectorySizes(directoryTree) {
  addSubDirectoryFileSize(directoryTree);
}

function addSubDirectoryFileSize(node) {
  if (node.children.length === 0) {
    return node.size;
  }

  const subSize = node.children
    .map(addSubDirectoryFileSize)
    .reduce((acc, curr) => acc + curr);

  node.size += subSize;
  return node.size;
}

function getRootNode(input) {
  const lines = input.split("\n");

  const directoryTree = {
    name: "root",
    size: 0,
    children: [],
  };

  let currentNode = directoryTree;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!line.startsWith("$ cd")) {
      continue;
    }

    if (line.includes("..")) {
      currentNode = currentNode.parent;
      continue;
    }

    const dirName = line.match(/\$ cd (.*)/)[1];
    const newNode = {
      name: dirName,
      size: 0,
      children: [],
      parent: currentNode,
    };
    currentNode.children.push(newNode);
    currentNode = newNode;

    let j = i + 2;

    while (true) {
      const proceedingLine = lines[j];

      if (j === lines.length || proceedingLine.startsWith("$")) {
        break;
      } else if (proceedingLine.startsWith("dir")) {
        // do nothing
      } else {
        const fileSize = Number(proceedingLine.split(" ")[0]);
        currentNode.size += fileSize;
      }
      j++;
    }
  }

  return directoryTree;
}
