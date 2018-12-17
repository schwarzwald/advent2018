class World {
  constructor() {
    this.veins = [];
    this.water = [];

    this.v = new Set();
    this.w = new Set();
  }

  addVein(vein) {
    this.veins.push(vein);

    for (let p1 = vein.interval[0]; p1 <= vein.interval[1]; p1++) {
      if (vein.direction == 'H') {
        this.v.add(this.id(p1, vein.start));
      } else {
        this.v.add(this.id(vein.start, p1));
      }
    }
  }

  addWater(water) {
    if (!this.isWater(...water)) {
      this.water.push(water);
      this.w.add(this.id(...water));
    }
  }

  id(x, y) {
    return `${x}#${y}`;
  }

  isClay(x, y) {
    let id = this.id(x, y);
    return this.v.has(id);
  }

  isWater(x, y) {
    let id = this.id(x, y);
    return this.w.has(id);
  }

  isEmpty(x, y) {
    return !this.isClay(x, y) && !this.isWater(x, y);
  }

  isPool(x, y) {
    return this.isWater(x, y) && this.isBound(x, y);
  }

  isBound(x, y, dir) {
    if (!dir) {
      return this.isBound(x, y, -1) && this.isBound(x, y, 1);
    }

    for (let x1 = x + dir; !this.isClay(x1, y); x1 += dir) {
      if (!this.isWater(x1, y) && !this.isClay(x1, y)) {
        return false;
      }
    }

    return true;
  }
}

class Clay {
  constructor(definition) {
    let [_, t1, p1, , p2, p3] = /([xy])=(\d+), ([xy])=(\d+)\.\.(\d+)/.exec(definition);
    this.direction = t1 == 'x' ? 'V' : 'H';
    this.start = +p1;
    this.interval = [+p2, +p3];
  }

  contains(x, y) {
    if (this.direction == 'V') {
      return this.start == x && this.interval[0] <= y && this.interval[1] >= y;
    } else {
      return this.start == y && this.interval[0] <= x && this.interval[1] >= x;
    }
  }
}

module.exports = input => {
  const world = new World();
  input.split('\n').map(e => new Clay(e)).forEach(c => world.addVein(c));

  const minY = Math.min(...world.veins.filter(v => v.direction == 'V').map(v => v.interval[0]));
  const maxY = Math.max(...world.veins.filter(v => v.direction == 'V').map(v => v.interval[1]));

  let start = [500, 1];
  let stack = [start];

  while (stack.length) {
    const [x, y] = stack[stack.length - 1];

    world.addWater([x, y])
    let spils = world.isClay(x, y + 1) || world.isPool(x, y + 1);

    if (world.isEmpty(x, y + 1) && y + 1 <= maxY) {
      stack.push([x, y + 1]);
    } else if (world.isEmpty(x - 1, y) && spils) {
      stack.push([x - 1, y]);
    } else if (world.isEmpty(x + 1, y) && spils) {
      stack.push([x + 1, y]);
    } else {
      stack.pop();
    }
  }

  return world.water.filter(([x, y]) => y >= minY && world.isBound(x, y)).length;
}