const dist = ([x1, y1, z1], [x2, y2, z2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2);

module.exports = input => {
  const nanobots = input.split('\n')
    .map(e => /pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/.exec(e))
    .map(e => e.slice(1).map(Number));

  const max = nanobots.reduce((max, curr) => curr[3] > max[3] ? curr : max);

  return nanobots.filter(n => dist(max, n) <= max[3]).length;
}