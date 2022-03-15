const { readFile, writeFile } = require("fs/promises");
const path = "./data.txt";

formatData = (path) => {
  return readFile(path, "utf8").then((res) => {
    return res
      .split("\n")
      .map((item) => {
        // format data into array with date[0] and comment[1]
        return [item.slice(1, 17), item.slice(19)];
      })
      .sort((itemA, itemB) => {
        // sort array in ascending date order
        return new Date(itemA[0]) - new Date (itemB[0]);
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

formatData(path).then((res) => {
  const stringify = JSON.stringify(res, null, 4);
  writeFile("data.js", stringify);
});
