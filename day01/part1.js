module.exports = input =>
  input.split('\n')
    .reduce((acc, curr) => acc += +curr, 0);