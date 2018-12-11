const power = (gns, x, y) => ((((x + 10) * y + gns) * (x + 10)) / 100 | 0) % 10 - 5;

module.exports = input => {
  const grid = [...new Array(300)].map((_, y) =>
    [...new Array(300)].map((_, x) => power(+input, x + 1, y + 1)));

  let max = -1000;
  let maxPos = [];

  let total = 0;

  [0, 1, 2].forEach(y =>
    [0, 1, 2].forEach(x => total += grid[y][x]));

  for (let y = 0; y < 298; y++) {
    for (let x of [0, 1, 2]) {
      if (y > 0) {
        total -= grid[y - 1][x];
        total += grid[y + 3 - 1][x];
      }
    }

    let totalTemp = total;

    for (let x = 0; x < 298; x++) {
      if (x > 0) {
        for (let dy of [0, 1, 2]) {
          totalTemp -= grid[y + dy][x - 1];
          totalTemp += grid[y + dy][x + 3 - 1];
        }
      }

      if (totalTemp > max) {
        max = totalTemp;
        maxPos = [x, y];
      }
    }
  }

  return [maxPos[0] + 1, maxPos[1] + 1];
} 