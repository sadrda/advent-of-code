const fs = require("fs");

const input = fs.readFileSync("a19.txt").toString();
const scans = input
  .replaceAll(/--- scanner \d+ ---/g, "")
  .trim()
  .split("\n\n\n")
  .map((scan) => scan.split("\n").map((line) => line.split(",").map(Number)));

const rotationScans = scans.map((scan) => {
  const rotationScan = [];
  rotationScan.push(scan.map((line) => [line[0], line[1], line[2]]));
  rotationScan.push(scan.map((line) => [-line[0], line[1], line[2]]));
  rotationScan.push(scan.map((line) => [line[0], -line[1], line[2]]));
  rotationScan.push(scan.map((line) => [line[0], line[1], -line[2]]));
  rotationScan.push(scan.map((line) => [-line[0], -line[1], line[2]]));
  rotationScan.push(scan.map((line) => [line[0], -line[1], -line[2]]));
  rotationScan.push(scan.map((line) => [-line[0], line[1], -line[2]]));
  rotationScan.push(scan.map((line) => [-line[0], -line[1], -line[2]]));

  rotationScan.push(scan.map((line) => [line[0], line[2], line[1]]));
  rotationScan.push(scan.map((line) => [-line[0], line[2], line[1]]));
  rotationScan.push(scan.map((line) => [line[0], -line[2], line[1]]));
  rotationScan.push(scan.map((line) => [line[0], line[2], -line[1]]));
  rotationScan.push(scan.map((line) => [-line[0], -line[2], line[1]]));
  rotationScan.push(scan.map((line) => [line[0], -line[2], -line[1]]));
  rotationScan.push(scan.map((line) => [-line[0], line[2], -line[1]]));
  rotationScan.push(scan.map((line) => [-line[0], -line[2], -line[1]]));

  rotationScan.push(scan.map((line) => [line[1], line[0], line[2]]));
  rotationScan.push(scan.map((line) => [-line[1], line[0], line[2]]));
  rotationScan.push(scan.map((line) => [line[1], -line[0], line[2]]));
  rotationScan.push(scan.map((line) => [line[1], line[0], -line[2]]));
  rotationScan.push(scan.map((line) => [-line[1], -line[0], line[2]]));
  rotationScan.push(scan.map((line) => [line[1], -line[0], -line[2]]));
  rotationScan.push(scan.map((line) => [-line[1], line[0], -line[2]]));
  rotationScan.push(scan.map((line) => [-line[1], -line[0], -line[2]]));

  rotationScan.push(scan.map((line) => [line[1], line[2], line[0]]));
  rotationScan.push(scan.map((line) => [-line[1], line[2], line[0]]));
  rotationScan.push(scan.map((line) => [line[1], -line[2], line[0]]));
  rotationScan.push(scan.map((line) => [line[1], line[2], -line[0]]));
  rotationScan.push(scan.map((line) => [-line[1], -line[2], line[0]]));
  rotationScan.push(scan.map((line) => [line[1], -line[2], -line[0]]));
  rotationScan.push(scan.map((line) => [-line[1], line[2], -line[0]]));
  rotationScan.push(scan.map((line) => [-line[1], -line[2], -line[0]]));

  rotationScan.push(scan.map((line) => [line[2], line[0], line[1]]));
  rotationScan.push(scan.map((line) => [-line[2], line[0], line[1]]));
  rotationScan.push(scan.map((line) => [line[2], -line[0], line[1]]));
  rotationScan.push(scan.map((line) => [line[2], line[0], -line[1]]));
  rotationScan.push(scan.map((line) => [-line[2], -line[0], line[1]]));
  rotationScan.push(scan.map((line) => [line[2], -line[0], -line[1]]));
  rotationScan.push(scan.map((line) => [-line[2], line[0], -line[1]]));
  rotationScan.push(scan.map((line) => [-line[2], -line[0], -line[1]]));

  rotationScan.push(scan.map((line) => [line[2], line[1], line[0]]));
  rotationScan.push(scan.map((line) => [-line[2], line[1], line[0]]));
  rotationScan.push(scan.map((line) => [line[2], -line[1], line[0]]));
  rotationScan.push(scan.map((line) => [line[2], line[1], -line[0]]));
  rotationScan.push(scan.map((line) => [-line[2], -line[1], line[0]]));
  rotationScan.push(scan.map((line) => [line[2], -line[1], -line[0]]));
  rotationScan.push(scan.map((line) => [-line[2], line[1], -line[0]]));
  rotationScan.push(scan.map((line) => [-line[2], -line[1], -line[0]]));

  return rotationScan;
});

const startScan = rotationScans[0][0];
const detectedScanners = {
  0: [0, 0, 0, startScan],
};

const detectNearbyScanners = (currentScanner, currentIndex) => {
  const [offsetX, offsetY, offsetZ] = detectedScanners[currentIndex];
  for (let i = 0; i < rotationScans.length; i++) {
    if (detectedScanners[i]) continue;
    const rotationScan = rotationScans[i];
    for (let j = 0; j < rotationScan.length; j++) {
      const scan = rotationScan[j];
      const diffs = [];

      for (const currentBeacon of currentScanner) {
        for (const coord of scan) {
          diffs.push([
            currentBeacon[0] - coord[0],
            currentBeacon[1] - coord[1],
            currentBeacon[2] - coord[2],
          ]);
        }
      }

      const histogram = {};
      for (const diff of diffs) {
        const stringDiff = JSON.stringify(diff);
        if (histogram[stringDiff]) {
          histogram[stringDiff]++;
        } else histogram[stringDiff] = 1;
      }
      for (const [scannerOffset, sharedBeaconCount] of Object.entries(
        histogram
      )) {
        if (sharedBeaconCount >= 12) {
          const [nextScannerOffsetX, nextScannerOffsetY, nextScannerOffsetZ] =
            JSON.parse(scannerOffset);
          detectedScanners[i] = [
            offsetX + nextScannerOffsetX,
            offsetY + nextScannerOffsetY,
            offsetZ + nextScannerOffsetZ,
            scan,
          ];
          console.log(currentIndex, "calls", i);
          detectNearbyScanners(scan, i, detectedScanners);
        }
      }
    }
  }
};
detectNearbyScanners(startScan, 0);

const field = {};

Object.values(detectedScanners).forEach((detectedScanner) => {
  const [offsetX, offsetY, offsetZ, scan] = detectedScanner;
  scan.forEach((beacon) => {
    const [x, y, z] = beacon;
    const beaconPos = JSON.stringify([x + offsetX, y + offsetY, z + offsetZ]);
    if (field[beaconPos]) field[beaconPos]++;
    else field[beaconPos] = 1;
  });
});

let maxDistance = -Infinity;
Object.values(detectedScanners).forEach((detectedScanner) => {
  const [offsetX, offsetY, offsetZ] = detectedScanner;
  Object.values(detectedScanners).forEach((detectedScanner) => {
    const [offsetX2, offsetY2, offsetZ2] = detectedScanner;
    const distance =
      Math.abs(offsetX - offsetX2) +
      Math.abs(offsetY - offsetY2) +
      Math.abs(offsetZ - offsetZ2);
    maxDistance = Math.max(distance, maxDistance);
  });
});
console.log(maxDistance);
