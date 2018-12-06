const dist = ([x1, y1], [x2, y2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2);
const totalDist = (pos, positions) => positions.reduce((sum, p) => sum + dist(p, pos), 0);
const id = ([x, y]) => `${x}#${y}`;

const LIMIT = 10000;

module.exports = input => {
  const positions = input.split('\n').map(e => e.split(', ').map(Number));

  const queue = [[
    ((Math.min(...positions.map(e => e[0])) + Math.max(...positions.map(e => e[0]))) / 2) | 0,
    ((Math.min(...positions.map(e => e[1])) + Math.max(...positions.map(e => e[1]))) / 2) | 0]];

  const visited = new Set();

  let size = 0;
  let areaFound = false;

  while (queue.length) {
    let [x, y] = queue.shift();

    if (visited.has(id([x, y]))) {
      continue;
    }

    visited.add(id([x, y]));
    let inArea = totalDist([x, y], positions) < LIMIT;

    if (inArea) {
      size++;
      areaFound = true;
    }

    if (inArea || !areaFound) {
      [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].forEach(e => queue.push(e));
    }
  }

  return size;

}