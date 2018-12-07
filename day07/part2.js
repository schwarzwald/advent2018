const WORKER_COUNT = 5;
const DELAY = 60;

module.exports = input => {
  const dependencies = input.split('\n')
    .map(e => /Step (\w) must be finished before step (\w) can begin./.exec(e))
    .map(([_, b, a]) => [a, b]);

  const all = [...new Set(dependencies.reduce((all, [a, b]) => [...all, a, b], []))].sort();
  const processed = [];
  const workers = [...new Array(WORKER_COUNT)]
    .map(_ => new Object({
      processing: null,
      remaining: 0
    }));

  let time = 0;

  while (processed.length < all.length) {
    for (let worker of workers) {
      if (worker.remaining == 0) {
        const processing = workers.filter(w => w.processing).map(w => w.processing);
        const free = all.find(a =>
          !processed.includes(a) &&
          !processing.includes(a) &&
          (!dependencies.some(([x]) => a === x) ||
            dependencies.filter(([x]) => a == x).every(([_, y]) => processed.includes(y))));

        if (free) {
          worker.processing = free;
          worker.remaining = DELAY + free.charCodeAt(0) - 65;
        } else {
          worker.processing = null;
        }
      } else {
        worker.remaining--;
      }
    }

    processed.push(...workers.filter(w => w.remaining == 0 && w.processing).map(w => w.processing))
    time++
  }

  return time;
}