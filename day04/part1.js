module.exports = input => [
    ...input.split('\n')
    .sort()
    .reduce((res, line) => {
      let match = /Guard #(\d+) begins shift/.exec(line);
      if (match) {
        res.current = match[1];
      }

      match = /\[\d+-\d+-\d+ 00:(\d+)\] falls asleep/.exec(line);

      if (match) {
        res.sleepingFrom = +match[1];
      }

      match = /\[\d+-\d+-\d+ 00:(\d+)\] wakes up/.exec(line);

      if (match) {
        const sleepingTo = +match[1];
        const guard = res.guards.get(res.current) || {
          time: 0,
          minutes: [...new Array(60)].map(e => 0)
        };

        res.guards.set(res.current, guard);

        for (let i = res.sleepingFrom; i < sleepingTo; i++) {
          guard.minutes[i]++;
          guard.time++;
        }
      }

      return res;
    }, {
      current: null,
      sleepingFrom: null,
      guards: new Map()
    }).guards.entries()
  ]
  .sort((a, b) => b[1].time - a[1].time)
  .map(e => e[0] * e[1].minutes.reduce((max, val, i, arr) => val > arr[max] ? i : max))[0]