class Marble {

  constructor(value) {
    this.value = value;
    this._next = this;
    this._previous = this;
  }

  add(other) {
    other._next = this._next;
    other._previous = this;
    this._next._previous = other;
    this._next = other;
    return other;
  }

  previous(count) {
    let previous = this._previous;
    while (--count) {
      previous = previous._previous;
    }

    return previous;
  }

  next(count) {
    let next = this._next;
    while (--count) {
      next = next._next;
    }

    return next;
  }

  remove() {
    this._previous._next = this._next;
    this._next._previous = this._previous;
    return this._next;
  }

}

module.exports = input => {
  const [, players, target] = /(\d+) players; last marble is worth (\d+) points/.exec(input).map(Number);
  const score = [...new Array(players)].map(_ => 0);

  let current = new Marble(0);
  let player = 0;

  for (let i = 1; i <= target; i++) {
    if (i % 23 == 0) {
      current = current.previous(7);
      score[player] += i + current.value;
      current = current.remove();
    } else {
      current = current.next(1).add(new Marble(i));
    }

    player = (player + 1) % players;
  }

  return Math.max(...score);
}