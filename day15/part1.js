class Unit {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.hp = 200;
  }

  alive() {
    return this.hp > 0;
  }
}

const id = (x, y) => `${x}#${y}`;

module.exports = input => {
  const units = [];
  const grid = [];

  const rows = input.split('\n');
  for (let y = 0; y < rows.length; y++) {
    const row = [...rows[y].trim()];
    grid.push([]);

    for (let x = 0; x < row.length; x++) {
      grid[y][x] = row[x] != '#';

      if (row[x] == 'G' || row[x] == 'E') {
        units.push(new Unit(row[x], x, y));
      }
    }
  }

  let rounds = 0;

  while (units.filter(a => a.type == 'E' && a.alive()).length && units.filter(a => a.type == 'G' && a.alive()).length) {
    const sorted = units.sort((a, b) => (100 * a.y + a.x) - (100 * b.y + b.x));
    let fullRound = true;

    for (const unit of sorted) {
      if (!unit.alive()) {
        continue;
      }

      const targets = sorted.filter(a => a.type != unit.type && a.alive());

      if (targets.length == 0) {
        fullRound = false;
        break;
      }
      let inRange = targets.filter(a => (a.x == unit.x && Math.abs(a.y - unit.y) == 1) || (a.y == unit.y && Math.abs(a.x - unit.x) == 1));

      if (inRange.length == 0) {
        const queue = [
          [[unit.x, unit.y - 1]],
          [[unit.x - 1, unit.y]],
          [[unit.x + 1, unit.y]],
          [[unit.x, unit.y + 1]]];

        const visited = new Set();
        let minPath = null;
        let min = 1000;

        while (queue.length) {
          const path = queue.shift();
          const [x, y] = path[path.length - 1];

          if (visited.has(id(x, y))) {
            continue;
          }

          visited.add(id(x, y));

          if (!grid[y][x] || units.find(a => a.alive() && a.x == x && a.y == y) || path.length > min) {
            continue;
          }

          const target = targets.find(a => (a.x == x && Math.abs(a.y - y) == 1) || (a.y == y && Math.abs(a.x - x) == 1));

          if (target) {
            if (path.length < min) {
              min = path.length;
              minPath = path;
            } else if (path.length == min) {
              const [x1, y1] = path[path.length - 1];
              const [x2, y2] = minPath[minPath.length - 1];

              if ((100 * y1 + x1) < (100 * y2 + x2)) {
                minPath = path;
              }
            }
          }

          for (const segment of [[x, y - 1], [x - 1, y], [x + 1, y], [x, y + 1]]) {
            const newPath = path.slice();
            newPath.push(segment);
            queue.push(newPath);
          }
        }

        if (minPath) {
          [unit.x, unit.y] = minPath[0];
        }
      }

      inRange = targets.filter(a => (a.x == unit.x && Math.abs(a.y - unit.y) == 1) || (a.y == unit.y && Math.abs(a.x - unit.x) == 1));

      if (inRange.length) {
        const toAttack = inRange.sort((a, b) => (a.hp * 10000 + a.y * 100 + a.x) - (b.hp * 10000 + a.y * 100 + a.x))[0];
        toAttack.hp -= 3;
      }
    }

    if (fullRound) {
      rounds++;
    }
  }

  return rounds * units.filter(a => a.alive())
    .map(a => a.hp)
    .reduce((sum, curr) => sum + curr);
}