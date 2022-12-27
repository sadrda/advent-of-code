const fs = require("fs");

const MINUTES = 26;

console.time();
main();
console.timeEnd();

function main() {
  const input = fs.readFileSync("a16.txt").toString();
  const map = getMap(input);
  const maxPressure = getMaxPressure(map);
  console.log(maxPressure);
}

function getMaxPressure(map) {
  const startingState = {
    position: "AA",
    ePosition: "AA",
    pressure: 0,
    activatedValves: [],
    turningValves: [],
  };

  const states = setStates(0, map, [startingState]);

  return states
    .map((state) => state.pressure)
    .reduce((acc, curr) => Math.max(acc, curr));
}

function fillNextHumanStates(nextStates, map, state) {
  const { position, ePosition, activatedValves, turningValves, pressure } =
    state;
  const { targets, flow } = map[position];

  if (!activatedValves.includes(position) && flow > 0) {
    nextStates.push({
      position,
      ePosition,
      activatedValves: [...activatedValves],
      pressure,
      turningValves: [...turningValves, position],
    });
  }

  for (const target of targets) {
    nextStates.push({
      position: target,
      ePosition,
      activatedValves: [...activatedValves],
      pressure,
      turningValves: [...turningValves],
    });
  }
}

function fillNextElephantStates(nextStates, map, state) {
  const { position, ePosition, activatedValves, turningValves, pressure } =
    state;
  const { targets, flow } = map[ePosition];

  if (
    !activatedValves.includes(ePosition) &&
    flow > 0 &&
    ePosition !== position
  ) {
    nextStates.push({
      position,
      ePosition,
      activatedValves: [...activatedValves],
      pressure,
      turningValves: [...turningValves, ePosition],
    });
  }

  for (const target of targets) {
    nextStates.push({
      position,
      ePosition: target,
      activatedValves: [...activatedValves],
      pressure,
      turningValves: [...turningValves],
    });
  }
}

function setStates(minute, map, states) {
  console.log({ minute, states: states.length });
  if (minute === MINUTES) {
    return states;
  }

  // get next states
  let nextStates = [];
  for (const state of states) {
    const nextInterStates = [];
    fillNextHumanStates(nextInterStates, map, state);

    for (const iState of nextInterStates) {
      fillNextElephantStates(nextStates, map, iState);
    }
  }

  // add pressure
  for (const state of nextStates) {
    for (const activatedValve of state.activatedValves) {
      state.pressure += map[activatedValve].flow;
    }
  }

  // activate valves
  for (const state of nextStates) {
    for (const turningValve of state.turningValves) {
      state.activatedValves.push(turningValve);
      state.turningValves = [];
    }
  }

  // filtering
  nextStates = nextStates
    .sort((s1, s2) => s2.pressure - s1.pressure)
    .slice(0, 50000);

  // invoke next gen
  return setStates(minute + 1, map, nextStates);
}

function getMap(input) {
  const map = {};
  const lines = input.split("\n");
  for (const line of lines) {
    const [_1, valve, flow, _2, _3, _4, targets] = line.match(
      /Valve (.*) has flow rate=(.*); (tunnel|tunnels) (lead|leads) to (valve|valves) (.*)/
    );
    map[valve] = {
      flow: Number(flow),
      targets: targets.split(", "),
    };
  }

  return map;
}
