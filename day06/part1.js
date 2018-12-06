const dist = ([x1, y1], [x2, y2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2);
const id = ([x, y]) => `${x}#${y}`;

const countClosest = (pos, positions) => {
  const queue = [pos];
  const visited = new Set();
  let result = 0;

  while (queue.length) {
    const [x, y] = queue.shift();

    if (visited.has(id([x, y]))) {
      continue;
    }

    visited.add(id([x, y]));

    const dists = positions.map(p => dist(p, [x, y]));
    let min = Math.min(...dists);

    if (min == dist([x, y], pos) && dists.filter(e => e == min).length == 1) {
      result++;

      [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]
        .filter(e => e[0] != x || e[1] != y)
        .forEach(e => queue.push(e));
    }
  }

  return result;
}

module.exports = input => {
  const positions = input.split('\n').map(e => e.split(', ').map(Number));

  const unbound = positions.filter(([x1, y1], i, arr) =>
    arr.every(([x2, y2], j) => i == j || x2 > x1 || Math.abs(y2 - y1) > Math.abs(x2 - x1)) ||
    arr.every(([x2, y2], j) => i == j || x2 < x1 || Math.abs(y2 - y1) > Math.abs(x2 - x1)) ||
    arr.every(([x2, y2], j) => i == j || y2 > y1 || Math.abs(x2 - x1) > Math.abs(y2 - y1)) ||
    arr.every(([x2, y2], j) => i == j || y2 < y1 || Math.abs(x2 - x1) > Math.abs(y2 - y1)));

  return positions.reduce((max, p) =>
    !unbound.some(e => e[0] == p[0] && e[1] == p[1]) ? Math.max(max, countClosest(p, positions)) : max, 0);
}