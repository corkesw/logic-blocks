const { readFile } = require("fs/promises");

exports.formatData = (path) => {
  return readFile(path, "utf8").then((res) => {
    return res
      .split("\n")
      .map((item) => {
        return [new Date(item.slice(1, 17)), item.slice(19)];
      })
      .sort((itemA, itemB) => {
        return itemA[0] - itemB[0];
      })
      .map((item) => {
        if (item[1][6] === "#") {
          const guardNum = item[1].split(" ")[1].slice(1);
          return [item[0], guardNum]
        } else return item;
      });
  });
};
