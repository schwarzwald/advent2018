const GENERATIONS = 50000000000;

module.exports = input => {
  input = input.split('\n');

  let rules = input.slice(2)
    .map(e => /([#\.]{5}) => ([#\.])/.exec(e.trim()))
    .reduce((map, [_, from, to]) => {
      map.set(from, to);
      return map;
    }, new Map());

  let state = input[0].substring(15).trim();
  let offset = 0;
  let lastState = state;
  let lastOffset = 0;

  for (let i = 0; i < GENERATIONS; i++) {
    lastOffset = offset;
    lastState = state;

    state = ['.', '.', ...state, '.', '.'].map((_, i, s) =>
      rules.get((s[i - 2] || '.') + (s[i - 1] || '.') + s[i] + (s[i + 1] || '.') + (s[i + 2] || '.')) || '.')
      .join('');

    offset += -2 + state.indexOf('#');
    state = state.substring(state.indexOf('#'), state.lastIndexOf('#') + 1);

    if (lastState == state) {
      offset += (GENERATIONS - i) * (offset - lastOffset) - 1;
      return [...state].reduce((sum, c, i) => sum + (c == '#' ? i + offset : 0), 0);
    }
  }
} 