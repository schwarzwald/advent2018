const MINUTES = 1000000000;
const idx = (x, y, size) => y * size + x;

module.exports = input => {
  const size = input.split('\n').length;;

  let grid = input.split('\n').reduce((grid, line) => [...grid, ...line.trim()], []);
  let serialized = grid.join('');
  let visited = [serialized];

  for (let m = 0; m < MINUTES; m++) {
    grid = grid.map((e, i, arr) => {
      const x = i % size;
      const y = i / size | 0;

      let trees = 0;
      let lumberyard = 0;

      [
        x > 0 ? arr[idx(x - 1, y, size)] : null,
        x > 0 && y > 0 ? arr[idx(x - 1, y - 1, size)] : null,
        y > 0 ? arr[idx(x, y - 1, size)] : null,
        x < size - 1 && y > 0 ? arr[idx(x + 1, y - 1, size)] : null,
        x < size - 1 ? arr[idx(x + 1, y, size)] : null,
        x < size - 1 && y < size - 1 ? arr[idx(x + 1, y + 1, size)] : null,
        y < size - 1 ? arr[idx(x, y + 1, size)] : null,
        x > 0 && y < size - 1 ? arr[idx(x - 1, y + 1, size)] : null,
      ].forEach(e => {
        switch (e) {
          case '|': trees++; break;
          case '#': lumberyard++; break;
        }
      });

      if (e == '.') {
        return trees >= 3 ? '|' : e;
      }

      if (e == '|') {
        return lumberyard >= 3 ? '#' : e;
      }

      if (e == '#') {
        return lumberyard >= 1 && trees >= 1 ? '#' : '.';
      }

    });

    serialized = grid.join('');

    if (visited.includes(serialized)) {
      let position = visited.indexOf(serialized);
      let remaining = (MINUTES - m - 1);
      let period = m - position + 1;
      serialized = visited[position + (remaining % period)];
      break;
    }

    visited.push(serialized);
  }

  return [...serialized].filter(e => e == '#').length * [...serialized].filter(e => e == '|').length;
}