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
          return [item[0], Number(guardNum)]
        } else return item;
      });
  });
};

exports.createTable = (data) => {
  console.log(data)
}
