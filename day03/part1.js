module.exports = input =>
  input.split('\n')
  .map(e => /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/.exec(e))
  .reduce((grid, [m, id, x, y, w, h]) => {
    for (let i = y; i < +y + +h; i++) {
      grid[i] = grid[i] || [];

      for (let j = x; j < +x + +w; j++) {
        grid[i][j] = (grid[i][j] || 0) + 1;
      }
    }

    return grid;
  }, [])
  .reduce((res, row) => res + row.filter(v => v > 1).length, 0);