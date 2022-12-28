const fs = require("fs");

console.time();
main();
console.timeEnd();

function main() {
  const input = fs.readFileSync("a15.txt").toString();
  const { sensors } = getSensors(input);
  logTuningFrequency(sensors);
}

function logTuningFrequency(sensors) {
  for (const sensor of sensors) {
    const { x, y, distance } = sensor;
    const dp = distance + 1;

    for (let i = 0; i <= dp; i++) {
      const eX = x + i;
      const eY = y + dp - i;

      const isWithinSensorRange = sensors.some(
        (sensor) =>
          Math.abs(eX - sensor.x) + Math.abs(eY - sensor.y) <= sensor.distance
      );

      if (!isWithinSensorRange && eX <= 4000000 && eY <= 4000000) {
        console.log(eX * 4000000 + eY);
      }
    }
  }
}

function getSensors(input) {
  const rows = input.split("\n");
  const sensors = [];

  for (const row of rows) {
    const [_, sx, sy, bx, by] = row.match(
      /Sensor at x=(.*), y=(.*): closest beacon is at x=(.*), y=(.*)/
    );

    const beacon = {
      x: Number(bx),
      y: Number(by),
    };

    const sensor = {
      x: Number(sx),
      y: Number(sy),
    };

    const distance =
      Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y);
    sensor.distance = distance;

    sensors.push(sensor);
  }

  return { sensors };
}
