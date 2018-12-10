module.exports = input => {
  const points = input.split('\n')
    .map(e => /position=<(\s?-?\d+), (\s?-?\d+)> velocity=<(\s?-?\d+), (\s?-?\d+)>/.exec(e))
    .map(e => e.map(Number))
    .map(([_, px, py, vx, vy]) => new Object({ px, py, vx, vy }));

  while (true) {
    let minX = Math.min(...points.map(e => e.px));
    let maxX = Math.max(...points.map(e => e.px));
    let minY = Math.min(...points.map(e => e.py));
    let maxY = Math.max(...points.map(e => e.py));

    if (minX >= 0 && minY >= 0 && (maxY - minY) <= 9) {
      return points.reduce((grid, point) => {
        grid[point.py - minY][point.px - minX] = 1;
        return grid;
      }, [...new Array(maxY - minY + 1)].map(_ => [...new Array(maxX - minX + 1)].map(_ => 0)))
        .map(row => row.map(p => p ? '#' : ' ').join(''))
        .join('\n');
    }

    points.forEach(p => {
      p.px += p.vx;
      p.py += p.vy;
    });
  }

}