const fs = require("fs");

const MINUTES = 32;
const STARTING_MINERALS = {
  ore: 0,
  clay: 0,
  obsidian: 0,
  geode: 0,
};
const STARTING_ROBOTS = {
  ore: 1,
  clay: 0,
  obsidian: 0,
  geode: 0,
};
const STARTING_TBF_ROBOTS = {
  ore: 0,
  clay: 0,
  obsidian: 0,
  geode: 0,
};
const MINERAL_VALUES = {
  ore: 1,
  clay: 40,
  obsidian: 800,
  geode: 16000,
};

main();

function main() {
  console.time();
  const input = fs.readFileSync("a19.txt").toString();
  const blueprints = getBlueprints(input);

  let geodes = [];
  for (let n = 0; n < 3; n++) {
    const blueprint = blueprints[n];
    const maxGeodes = getMaxGeodes(blueprint);
    geodes.push(maxGeodes);
  }
  console.log(geodes[0] * geodes[1] * geodes[2]);
  console.timeEnd();
}
function getMaxGeodes(blueprint) {
  const startingStates = [
    {
      minerals: { ...STARTING_MINERALS },
      robots: { ...STARTING_ROBOTS },
      tbfRobots: { ...STARTING_TBF_ROBOTS },
    },
  ];
  const geodes = getGeodes(0, blueprint, startingStates);
  const maxGeodes = Math.max(...geodes);

  return maxGeodes;
}

function getGeodes(minute, blueprint, states) {
  if (minute === MINUTES) {
    //console.log(states);
    return states.map((state) => state.minerals.geode);
  }

  // buying
  let possibleNextStates = [];
  for (const state of states) {
    getPossibleNextStates(possibleNextStates, state, blueprint);
  }

  // farming
  for (const state of possibleNextStates) {
    for (const [type, amount] of Object.entries(state.robots)) {
      state.minerals[type] += amount;
    }
  }

  // deploying robots
  for (const state of possibleNextStates) {
    for (const [type, amount] of Object.entries(state.tbfRobots)) {
      state.robots[type] += amount;
      state.tbfRobots[type] = 0;
    }
  }

  // filtering
  possibleNextStates = possibleNextStates
    .sort(
      (s1, s2) => getValueFromState(s2, minute) - getValueFromState(s1, minute)
    )
    .slice(0, 1000);

  // invoke next gen
  return getGeodes(minute + 1, blueprint, possibleNextStates);
}

function getValueFromState(state, minute) {
  const restMinutes = MINUTES - minute - 1;

  let value = 0;
  for (const type of Object.keys(state.robots)) {
    value += state.minerals[type] * MINERAL_VALUES[type];
    value += restMinutes * state.robots[type] * MINERAL_VALUES[type];
  }

  return value;
}

function getPossibleNextStates(possibleNextStates, state, blueprint) {
  possibleNextStates.push(getStateCopy(state));

  for (const requirement of blueprint) {
    const costs = requirement.costs;
    const type = requirement.type;
    const enoughMinerals = costs.every((cost) => {
      const { amount, type } = cost;

      return state.minerals[type] >= amount;
    });

    if (enoughMinerals) {
      const newState = getStateCopy(state);

      for (const cost of costs) {
        newState.minerals[cost.type] -= cost.amount;
      }

      newState.tbfRobots[type]++;
      possibleNextStates.push(newState);
      //getPossibleNextStates(possibleNextStates, newState, blueprint);
    }
  }

  return possibleNextStates;
}

function getStateCopy(state) {
  const { minerals, robots, tbfRobots } = state;

  return {
    minerals: { ...minerals },
    robots: { ...robots },
    tbfRobots: { ...tbfRobots },
  };
}

function getBlueprints(input) {
  const rawBlueprints = input.split("\n");
  const blueprints = rawBlueprints.map((rawBlueprint) => {
    const infos = rawBlueprint.split(": ")[1];
    const rawRequirements = infos.split(". ");

    const requirements = rawRequirements.map((rawRequirement) => {
      const [_, type, rawCost] = rawRequirement
        .replace(".", "")
        .match(/Each (.*) robot costs (.*)/);

      const costs = rawCost.split(" and ").map((cost) => {
        const [amount, type] = cost.split(" ");

        return { amount, type };
      });

      return {
        type,
        costs,
      };
    });

    return requirements;
  });

  return blueprints;
}
