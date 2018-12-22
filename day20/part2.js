class Node {
  constructor(value) {
    this.value = value;
    this.next = [];
  }

  add(node) {
    this.next.push(node);
  }
}


const build = (input, i, nodes) => {
  const output = [];
  let options = [...nodes];

  while (i < input.length) {
    if (input[i].match(/[NSWE^$]/)) {
      let node = new Node(input[i]);
      options.forEach(n => n.add(node));
      options = [node];
      i++;
    } else if (input[i] == '(') {
      let result = build(input, i + 1, options);
      i = result[0];
      options = result[1];
    } else if (input[i] == '|') {
      output.push(...options);
      options = [...nodes];
      i++;
    } else if (input[i] == ')') {
      if (input[i - 1] == '|') {
        output.push(...nodes);
      } else {
        output.push(...options);
      }
      return [i + 1, output];
    }
  }

  return [i, output];
}

const id = (x, y) => `${x}#${y}`;

module.exports = input => {
  const grid = new Map();
  const start = new Node('^');
  build(input, 1, [start]);

  let queue = [];
  start.next.forEach(p => queue.push([[0, 0], p]));
  grid.set(id(0, 0), [0, 0, '.']);

  const visited = new Set();

  while (queue.length) {
    let [position, current] = queue.shift();
    let door = [];

    if (visited.has(current)) {
      continue;
    }

    visited.add(current);

    if (current.value == 'N') {
      door = [position[0], position[1] - 1, '-'];
      position = [position[0], position[1] - 2];
    } else if (current.value == 'S') {
      door = [position[0], position[1] + 1, '-'];
      position = [position[0], position[1] + 2];
    } else if (current.value == 'E') {
      door = [position[0] + 1, position[1], '|'];
      position = [position[0] + 2, position[1]];
    } else if (current.value == 'W') {
      door = [position[0] - 1, position[1], '|'];
      position = [position[0] - 2, position[1]];
    } else if (current.value == '$') {
      continue;
    }

    grid.set(id(...door), door);
    grid.set(id(...position), [position[0], position[1], '.']);

    current.next.forEach(p => queue.push([position, p]));
  }

  const distances = new Map();
  queue = [[0, 0, 0]];

  while (queue.length) {
    let [x, y, dist] = queue.shift();

    let cell = grid.get(id(x, y));
    if (!cell) {
      continue;
    }
    let prev = distances.get(id(x, y));
    if (prev == null || (prev > dist)) {
      distances.set(id(x, y), dist);
    } else {
      continue;
    }

    if (grid.get(id(x, y - 1))) {
      queue.push([x, y - 2, dist + 1]);
    }
    if (grid.get(id(x, y + 1))) {
      queue.push([x, y + 2, dist + 1]);
    }
    if (grid.get(id(x - 1, y))) {
      queue.push([x - 2, y, dist + 1]);
    }
    if (grid.get(id(x + 1, y))) {
      queue.push([x + 2, y, dist + 1]);
    }
  }

  return [...distances.values()].filter(e => e >= 1000).length;
}