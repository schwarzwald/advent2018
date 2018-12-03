module.exports = input =>
  input.split('\n')
  .map(e => /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/.exec(e))
  .find(([m1, id1, x1, y1, w1, h1], i, lines) =>
    lines.every(([m2, id2, x2, y2, w2, h2]) =>
      id1 === id2 || +x1 + +w1 - 1 < x2 || x1 > +x2 + +w2 - 1 || +y1 + +h1 - 1 < y2 || y1 > +y2 + +h2 - 1
    )
  )[1];