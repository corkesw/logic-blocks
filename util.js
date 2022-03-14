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
  let asleepArray = [];

  const date = new Date(data[1][0]);

  let startMin;
  let asleep = true;
  if (date.getHours() === 23) startMin = 0;
  else startMin = date.getMinutes();

  data.forEach((_, index) => {
    let endMin = 59;
    index++;
    if (data[index + 1]) {
      endMin = new Date(data[index + 1][0]).getMinutes();
    }

    if (asleep) {
      for (let i = startMin; i <= endMin; i++) {
        asleepArray.push(i - 1);
      }
    }
    asleep = !asleep;
    startMin = endMin + 1;
  });
  return asleepArray;
};

exports.mapSleepMins = (guardList) => {
  console.log(guardList);
  const sleepyMins = {};
  for (const key in guardList) {
    sleepyMins[key] = guardList[key].sort(
      (a, b) =>
        guardList[key].filter((v) => v === a).length -
        guardList[key].filter((v) => v === b).length
    ).pop()
  }
  return sleepyMins;
};
