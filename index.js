const { formattedData } = require("./data");

const {
  createRef,
  asleepMins,
  mapSleepMins,
  makeDataBlocks,
} = require("./util");

const { guardList, startIndices, guards } = createRef(formattedData);

const dataBlocks = makeDataBlocks(formattedData, startIndices);

dataBlocks.forEach((block) => {
  // work out asleep time for each block and push to that guards sleep array
  const asleepTime = asleepMins(block);
  const guard = block[0][1];
  asleepTime.forEach((time) => {
    guardList[guard].push(time);
  });
});


const totalSleepyMins = guards
  .map((guard) => {
    return [guard, guardList[guard].length];
  })
  .sort((guardA, guardB) => {
    return guardA[1] - guardB[1];
  });

const sleepiestGuard = totalSleepyMins[totalSleepyMins.length - 1][0];

console.log(sleepiestGuard, "<<< sleepiestGuard");
const thisGuardsMins = {};

guardList[sleepiestGuard].forEach((min) => {
  if (!thisGuardsMins.hasOwnProperty(min)) thisGuardsMins[min] = 1;
  else thisGuardsMins[min]++;
});

const sleepiestMinute = Object.keys(thisGuardsMins).reduce((a, b) =>
  thisGuardsMins[a] > thisGuardsMins[b] ? a : b
);

console.log(sleepiestMinute, "<<< sleepiestMinute");

console.log(sleepiestGuard * sleepiestMinute);

const guardsSleepyMins = mapSleepMins(guardList);

console.log(guardsSleepyMins);
