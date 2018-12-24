const dist = ([x1, y1, z1], [x2, y2, z2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2);

const contains = ([bx, by, bz, bs], [sx, sy, sz, sr]) => {
  return [
    [bx, by, bz],
    [bx, by + bs, bz],
    [bx + bs, by, bz],
    [bx + bs, by + bs, bz],
    [bx, by, bz + bs],
    [bx, by + bs, bz + bs],
    [bx + bs, by, bz + bs],
    [bx + bs, by + bs, bz + bs]
  ].some(p => dist(p, [sx, sy, sz]) <= sr) ||
    [
      [sx + sr, sy, sz],
      [sx - sr, sy, sz],
      [sx, sy + sr, sz],
      [sx, sy - sr, sz],
      [sx, sy, sz + sr],
      [sx, sy, sz - sr],
    ].some(p => p[0] >= bx && p[0] <= bx + bs &&
      p[1] >= by && p[1] <= by + bs &&
      p[2] >= bz && p[2] <= bz + bs)
}

module.exports = input => {
  const nanobots = input.split('\n')
    .map(e => /pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/.exec(e))
    .map(e => e.slice(1).map(Number));

  const countPoint = p => nanobots.filter(n => dist(p, n) <= n[3]).length;
  const countBox = box => nanobots.filter(n => contains(box, n)).length;

  let totalMax = 0;

  const findByPartition = (bx, by, bz, bs) => {
    if (bs == 1) {
      let count = countPoint([bx, by, bz]);
      if (count > totalMax) {
        totalMax = Math.max(totalMax, count);
        return [[bx, by, bz]];
      }

      return [];
    }

    const half = bs / 2;
    const mx = bx + half;
    const my = by + half;
    const mz = bz + half;

    const sectors = [
      [bx, by, bz, half],
      [mx, by, bz, half],
      [bx, my, bz, half],
      [mx, my, bz, half],
      [bx, by, mz, half],
      [mx, by, mz, half],
      [bx, my, mz, half],
      [mx, my, mz, half]
    ];

    const results = [];

    for (let [px1, py1, pz1, ps1] of sectors) {
      if (countBox([px1, py1, pz1, ps1]) > totalMax) {
        results.push(...findByPartition(px1, py1, pz1, ps1));
      }
    }

    return results;
  }

  // Give the "cube-search" some good start by selecting the
  // vertex with most intersections
  for (let [x, y, z, r] of nanobots) {
    let vertices = [
      [x + r, y, z],
      [x - r, y, z],
      [x, y + r, z],
      [x, y - r, z],
      [x, y, z + r],
      [x, y, z - r]
    ]

    for (let v of vertices) {
      totalMax = Math.max(totalMax, countPoint(v));
    }
  }

  const min = nanobots.reduce((min, [x, y, z]) => Math.min(min, Math.min(x, y, z)), 0);
  const max = nanobots.reduce((max, [x, y, z]) => Math.max(max, Math.max(x, y, z)), 0);
  const range = 2 ** Math.ceil(Math.log2(Math.abs(min - max)));

  return Math.min(...findByPartition(min, min, min, range).filter(r => countPoint(r) == totalMax).map(r => dist([0, 0, 0], r)));
}