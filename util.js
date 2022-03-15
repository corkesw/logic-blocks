exports.createRef = (data) => {

  const guardList = {}; // keys of unique guard ids with array values
  const startIndices = []; // array of indices where each time data begins
  data.forEach((datum, index) => {
    if (typeof datum[1] === "number") {
      startIndices.push(index);
      if (!guardList.hasOwnProperty(datum[1])) {
        guardList[datum[1]] = [];
      }
    }
  });
  const guards = Object.keys(guardList); // list of unique guards
  return { guardList, startIndices, guards };
};

exports.asleepMins = (data) => {
  
  const asleepArray = [];
  // from index 1, guard is asleep
  let asleep = true;
  for (let i = 1; i < data.length; i++) {
    // set start and end of this block of time
    const start = Number(data[i][0].slice(14, 16));
    let end;
    if (i < data.length - 1) {
      end = Number(data[i + 1][0].slice(14, 16) -1);
    } else {
      end = 59;
    }
    if (asleep) {
      // if guard is asleep, push the minutes to the array
      for (let j = start; j <= end; j++) {
        asleepArray.push(j);
      }
    }
    asleep = !asleep;
  }
  return asleepArray;
};

exports.makeDataBlocks = (data, startIndices) => {
  const dataBlocks = [];
  startIndices.forEach((start, index) => {
    // for each list of data, set the start and end indices and create arrays of each block
    let end = startIndices[index + 1];
    if (isNaN(end)) end = data.length - 1;
    const currentData = data.slice(start, end);
    dataBlocks.push(currentData);
  });
  return dataBlocks;
};

exports.mapSleepMins = (guardList) => {
  const sleepyMins = {};
  for (const key in guardList) {
    sleepyMins[key] = guardList[key]
      .sort(
        (a, b) =>
          guardList[key].filter((v) => v === a).length -
          guardList[key].filter((v) => v === b).length
      )
      .pop();
  }
  return sleepyMins;
};
