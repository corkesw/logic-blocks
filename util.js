const { readFile } = require("fs/promises");

exports.formatData = (path) => {
  return readFile(path, "utf8").then((res) => {
    return res
      .split("\n")
      .map((item) => {
        // format data into array with date[0] and comment[1]
        return [new Date(item.slice(1, 17)), item.slice(19)];
      })
      .sort((itemA, itemB) => {
        // sort array in ascending date order
        return itemA[0] - itemB[0];
      })
      .map((item) => {
        // format comment to just the guard number where guard comes on shift
        if (item[1][6] === "#") {
          const guardNum = item[1].split(" ")[1].slice(1);
          return [item[0], Number(guardNum)];
        } else return item;
      });
  });
};

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
  if (data.length < 2) return [];
  const asleepArray = [];
  let asleep = true;
  for (let i = 1; i < data.length; i++) {
    const start = Number(data[i][0].slice(14, 16));
    let end;
    if (i < data.length - 1) {
      end = Number(data[i + 1][0].slice(14, 16));
    } else {
      end = 60;
    }
    if (asleep) {
      for (let j = start; j < end; j++) {
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
