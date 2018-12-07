module.exports = input => {
  const dependencies = input.split('\n')
    .map(e => /Step (\w) must be finished before step (\w) can begin./.exec(e))
    .map(([_, b, a]) => [a, b]);

  const all = [...new Set(dependencies.reduce((all, [a, b]) => [...all, a, b], []))].sort();
  const processed = [];

  while (processed.length < all.length) {
    processed.push(
      all.find(
        a => !processed.includes(a) &&
          (!dependencies.some(([x]) => a === x) ||
            dependencies.filter(([x]) => a == x).every(([_, y]) => processed.includes(y)))));
  }

  return processed.join('');
}