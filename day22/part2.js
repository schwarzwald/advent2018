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
const type = (x, y, depth, [tx, ty], cache) => erosion(x, y, depth, [tx, ty], cache) % 3;
const id = (x, y) => `${x}#${y}`;
const state = (x, y, g) => `${x}#${y}#${g}`;
const dist = (p1, p2) => Math.abs(p1[0] - p2[0]) + Math.abs(p1[1] - p2[1]);

module.exports = input => {
  const cache = new Map();
  let [depth, target] = input.split('\n');
  depth = +/(\d+)/.exec(depth)[0];
  target = target.substring(8).split(',').map(Number);

  let limit = dist([0, 0], target) * 8;
  let queue = [[0, 0, 'T']];
  const durations = new Map();

  let tst = state(target[0], target[1], 'T');

  let open = new Set();
  let visited = new Set();
  let gScore = new Map();
  let fScore = new Map();

  gScore.set(state(0, 0, 'T'), 0);
  fScore.set(state(0, 0, 'T'), dist([0, 0], target));
  open.add(state(0, 0, 'T'));

  while (queue.length) {
    queue = queue.sort(([q1x, q1y, q1g], [q2x, q2y, q2g]) => {
      let f1 = fScore.get(state(q1x, q1y, q1g));
      let f2 = fScore.get(state(q2x, q2y, q2g));

      f1 = f1 == null ? 100000 : f1;
      f2 = f2 == null ? 100000 : f2;

      return f1 - f2;
    });
    //queue.map(q => fScore.get(state(q)));
    let [x, y, g] = queue.shift();
    let st = state(x, y, g);
    open.delete(st);

    if (st == tst) {
      return gScore.get(tst);
    }

    visited.add(st);

    let neighbors = [];
    neighbors.push([x, y + 1]);
    neighbors.push([x + 1, y]);
    if (x > 0) {
      neighbors.push([x - 1, y]);
    }
    if (y > 0) {
      neighbors.push([x, y - 1]);
    }

    let tc = type(x, y, depth, target, cache);

    let possible = [];


    if (tc == 0) {
      possible.push([x, y, g == 'T' ? 'C' : 'T', 7]);
    } else if (tc == 1) {
      possible.push([x, y, g == 'C' ? 'N' : 'C', 7]);
    } else {
      possible.push([x, y, g == 'N' ? 'T' : 'N', 7]);
    }

    for (let [nx, ny] of neighbors) {
      let nt = type(nx, ny, depth, target, cache);

      if (tc == nt) {
        possible.push([nx, ny, g, 1]);
      } else if (tc == 0) {
        if (nt == 1) {
          if (g == 'C') {
            possible.push([nx, ny, g, 1]);
          }
        } else if (nt == 2) {
          if (g == 'T') {
            possible.push([nx, ny, g, 1]);
          }
        }
      } else if (tc == 1) {
        if (nt == 0) {
          if (g == 'C') {
            possible.push([nx, ny, g, 1]);
          }
        } else if (nt == 2) {
          if (g == 'N') {
            possible.push([nx, ny, g, 1]);
          }
        }
      } else if (tc == 2) {
        if (nt == 0) {
          if (g == 'T') {
            possible.push([nx, ny, g, 1]);
          }
        } else if (nt == 1) {
          if (g == 'N') {
            possible.push([nx, ny, g, 1]);
          }
        }
      }
    }

    for (let [px, py, pg, pt] of possible) {
      let pstate = state(px, py, pg);
      if (visited.has(pstate)) {
        continue;
      }

      let gst = gScore.get(st)
      gst = (gst == null ? 100000 : gst)

      let tscore = (gst == null ? 100000 : gst) + pt;

      let gpst = gScore.get(pstate);
      gpst = gpst == null ? 100000 : gpst;

      if (!open.has(pstate)) {
        open.add(pstate);
        queue.push([px, py, pg]);
      } else if (tscore >= gpst) {
        continue;
      }

      gScore.set(pstate, tscore);
      fScore.set(pstate, gScore.get(pstate) + dist([px, py], target));
    }
  }


  return durations.get(tst);
}