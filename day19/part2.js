module.exports = input => {
  const x = 10551315

  let sum = 0;
  for (let i = 1; i <= x; i++) {
    if (x % i == 0) {
      sum += i;
    }
  }

  return sum;
}