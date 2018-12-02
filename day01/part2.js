module.exports = input => {
  const list = input.split('\n').map(e => +e);
  const frequencies = new Set();
  let i = 0;
  let frequency = 0;

  while (true) {
    frequency += list[i++ % list.length];

    if (frequencies.has(frequency)) {
      return frequency
    }

    frequencies.add(frequency);
  }
}