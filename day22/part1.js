const index = (x, y, depth, [tx, ty], cache) => {
  let idx = id(x, y);
  if (cache.get(idx) != null) {
    return cache.get(idx);
  }

  if (x == 0 && y == 0) {
    val = 0;
  } else if (x == tx && y == ty) {
    val = 0;
  } else if (x == 0) {
    val = y * 48271
  } else if (y == 0) {
    val = x * 16807;
  } else {
    val = erosion(x - 1, y, depth, [tx, ty], cache) * erosion(x, y - 1, depth, [tx, ty], cache);
  }
  cache.set(idx, val);
  return val;
}

const erosion = (x, y, depth, [tx, ty], cache) => (index(x, y, depth, [tx, ty], cache) + depth) % 20183;
const risk = (x, y, depth, [tx, ty], cache) => erosion(x, y, depth, [tx, ty], cache) % 3;
const id = (x, y) => `${x}#${y}`;

module.exports = input => {
  const cache = new Map();
  let [depth, target] = input.split('\n');
  depth = +/(\d+)/.exec(depth)[0];
  target = target.substring(8).split(',').map(Number);

  let sum = 0;

  for (let x = 0; x <= target[0]; x++) {
    for (let y = 0; y <= target[1]; y++) {
      sum += risk(x, y, depth, target, cache);
    }

  }
  return sum;
}