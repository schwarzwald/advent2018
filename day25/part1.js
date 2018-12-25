const dist = ([x1, y1, z1, t1], [x2, y2, z2, t2]) => Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2) + Math.abs(t1 - t2);

module.exports = input => {
  const points = input.split('\n').map(e => e.split(',').map(Number));
  const constelations = [];

  for (const point of points) {
    const connecting = [];
    for (const constelation of constelations) {
      if (constelation.some(p => dist(p, point) <= 3)) {
        connecting.push(constelation);
      }
    }

    if (connecting.length) {
      connecting[0].push(point);

      for (let con of connecting.slice(1)) {
        let rem = constelations.splice(constelations.indexOf(con), 1)[0];
        connecting[0].push(...rem);
      }
    } else {
      constelations.push([point]);
    }
  }

  return constelations.length;
}