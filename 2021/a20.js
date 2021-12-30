const fs = require("fs");

const [algorithm, imageRaw] = fs
  .readFileSync("a20.txt")
  .toString()
  .split("\n\n");

let image = imageRaw.split("\n").map((line) => line.split(""));

const alterImage = (image, algorithm, outsidePixel) => {
  const outputImage = [];
  for (let y = -1; y <= image.length; y++) {
    const row = [];

    for (let x = -1; x <= image[0].length; x++) {
      const imageSequence = [];
      for (let sqY = y - 1; sqY < y + 2; sqY++) {
        for (let sqX = x - 1; sqX < x + 2; sqX++) {
          if (image[sqY]?.[sqX]) imageSequence.push(image[sqY][sqX]);
          else imageSequence.push(outsidePixel);
        }
      }
      const bitSequence = imageSequence.map((char) => (char === "#" ? 1 : 0));
      const algorithmIndex = parseInt(bitSequence.join(""), 2);
      row.push(algorithm[algorithmIndex]);
    }
    outputImage.push(row);
  }
  return outputImage;
};

for (let i = 0; i < 50; i++) {
  let outsidePixel = ".";
  if (i !== 0) {
    outsidePixel = i % 2 === 1 ? algorithm[0] : algorithm[algorithm.length - 1];
  }
  image = alterImage(image, algorithm, outsidePixel);
}

let sum = 0;
image.forEach((row) =>
  row.forEach((char) => {
    if (char === "#") sum++;
  })
);
console.log({ sum });
