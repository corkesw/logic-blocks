const { asleepMins, mapSleepMins } = require("./util");

describe("asleepMins", () => {
  it("returns an empty array when passed an empty array", () => {
    expect(asleepMins([])).toEqual([]);
  });
  it("returns an array of zero length when passed one entry", () => {
    expect(asleepMins([["1518-11-23T00:00:15.000Z", 1097]])).toHaveLength(0);
  });
  it("returns an array of zero length when guard is late on shift", () => {
    expect(asleepMins([["1518-11-23T00:49:15.000Z", 1097]])).toHaveLength(0);
  });
  it("returns asleep minutes when guard nods off", () => {
    const input = [
      ["1518-11-23T00:00:15.000Z", 1097],
      ["1518-11-23T00:53:15.000Z", "falls asleep"],
    ];
    expect(asleepMins(input)).toHaveLength(7);
  });
  it("returns the correct minutes when the guard wakes again", () => {
    const input = [
      ["1518-11-23T00:00:15.000Z", 1097],
      ["1518-11-23T00:13:15.000Z", "falls asleep"],
      ["1518-11-23T00:31:15.000Z", "wakes up"],
    ];
    expect(asleepMins(input)).toHaveLength(18);
  });
  it("works for a longer array", () => {
    const input = [
      ["1518-11-21T00:04:15.000Z", 1447],
      ["1518-11-21T00:25:15.000Z", "falls asleep"],
      ["1518-11-21T00:28:15.000Z", "wakes up"],
      ["1518-11-21T00:40:15.000Z", "falls asleep"],
      ["1518-11-21T00:59:15.000Z", "wakes up"],
    ];
    expect(asleepMins(input)).toHaveLength(22);
  });
});

describe("mapSleepMins", () => {
  it("should return the sleepiest min for one guard", () => {
    const input = {
      2887: [1, 2, 3, 4, 4, 5, 5, 4, 5, 5, 5],
    };
    expect(mapSleepMins(input)).toEqual({ 2887: 5 });
  });
  it("should work for multiple guards", () => {
    const input = {
      2887: [1, 2, 3, 4, 4, 5, 5, 4, 5, 5, 5],
      287: [1, 2, 3, 4, 4, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    };
    expect(mapSleepMins(input)).toEqual({ 2887: 5, 287: 6 });
  });
});
