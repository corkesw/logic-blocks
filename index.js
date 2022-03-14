const { formattedData } = require("./data");
const { createRef, asleepMins, mapSleepMins } = require("./util");

const { guardList, startIndices, guards } = createRef(formattedData);

console.log(guardList, startIndices, guards);

startIndices.forEach((start, index) => {
  // for each list of data, set the start and end indices and create arrays of each block
  let end = startIndices[index + 1] - 1;
  if (isNaN(end)) end = formattedData.length - 1;
  const currentData = formattedData.slice(start, end + 1);
  const guard = currentData[0][1];

  // for each block of time, push the asleep mins to that guards key
  const asleepTime = asleepMins(currentData);

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
