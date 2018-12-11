const power = (gns, x, y) => ((((x + 10) * y + gns) * (x + 10)) / 100 | 0) % 10 - 5;

module.exports = input => {
  const grid = [...new Array(300)].map((_, y) =>
    [...new Array(300)].map((_, x) => power(+input, x + 1, y + 1)));

  let max = -1000;
  let maxPos = [];

  for (let size = 1; size <= 300; size++) {
    let total = 0;

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        total += grid[y][x];
      }
    }

    for (let y = 0; y < 300 - size + 1; y++) {
      for (let x = 0; x < size; x++) {
        if (y > 0) {
          total -= grid[y - 1][x];
          total += grid[y + size - 1][x];
        }
      }

      let totalTemp = total;

      for (let x = 0; x < 300 - size + 1; x++) {
        if (x > 0) {
          for (let dy = 0; dy < size; dy++) {
            totalTemp -= grid[y + dy][x - 1];
            totalTemp += grid[y + dy][x + size - 1];
          }
        }

        if (totalTemp > max) {
          max = totalTemp;
          maxPos = [x, y, size];
        }
      }
    }
  }

  return [maxPos[0] + 1, maxPos[1] + 1, maxPos[2]];
} 