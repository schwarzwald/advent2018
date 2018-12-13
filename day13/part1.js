class Car {

  constructor(x, y, dx, dy) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.state = 0;
  }

  move() {
    this.x += this.dx;
    this.y += this.dy;
  }

  left() {
    [this.dx, this.dy] = [this.dy, -this.dx];
  }

  right() {
    [this.dx, this.dy] = [-this.dy, this.dx];
  }

  turn() {
    if (this.state == 0) {
      this.left();
    } else if (this.state == 2) {
      this.right();
    }

    this.state = (this.state + 1) % 3;
  }

}

module.exports = input => {
  const map = input.split('\n').map(e => [...e]);
  const cars = [];

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const c = map[y][x];

      if (c == '>') {
        cars.push(new Car(x, y, 1, 0));
      } else if (c == '<') {
        cars.push(new Car(x, y, -1, 0));
      } else if (c == 'v') {
        cars.push(new Car(x, y, 0, 1));
      } else if (c == '^') {
        cars.push(new Car(x, y, 0, -1));
      }
    }
  }

  while (true) {
    for (const car of cars.sort((a, b) => a.y == b.y ? a.x - b.x : a.y - b.y)) {
      const c = map[car.y][car.x];

      if (c == '/' && car.dx != 0 || c == '\\' && car.dy != 0) {
        car.left();
      } else if (c == '/' && car.dy != 0 || c == '\\' && car.dx != 0) {
        car.right();
      } else if (c == '+') {
        car.turn();
      }

      car.move();

      if (cars.find(other => other != car && other.x == car.x && other.y == car.y)) {
        return [car.x, car.y];
      }
    }
  }
}