module.exports = input => {
  const points = input.split('\n')
    .map(e => /position=<(\s?-?\d+), (\s?-?\d+)> velocity=<(\s?-?\d+), (\s?-?\d+)>/.exec(e))
    .map(e => e.map(Number))
    .map(([_, px, py, vx, vy]) => new Object({ px, py, vx, vy }));

  let time = 0;
  while (true) {
    let minX = Math.min(...points.map(e => e.px));
    let minY = Math.min(...points.map(e => e.py));
    let maxY = Math.max(...points.map(e => e.py));

    if (minX >= 0 && minY >= 0 && (maxY - minY) <= 9) {
      return time;
    }

    points.forEach(p => {
      p.px += p.vx;
      p.py += p.vy;
    });

    time++;
  }

}